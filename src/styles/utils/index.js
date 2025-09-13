"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStyleUtils = void 0;
const react_native_1 = require("react-native");
const Browser_1 = require("@libs/Browser");
const getPlatform_1 = require("@libs/getPlatform");
const UserUtils_1 = require("@libs/UserUtils");
// eslint-disable-next-line no-restricted-imports
const theme_1 = require("@styles/theme");
const colors_1 = require("@styles/theme/colors");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const __1 = require("..");
const autoCompleteSuggestion_1 = require("./autoCompleteSuggestion");
const cardStyles_1 = require("./cardStyles");
const containerComposeStyles_1 = require("./containerComposeStyles");
const ModalStyleUtils_1 = require("./generators/ModalStyleUtils");
const ReportActionContextMenuStyleUtils_1 = require("./generators/ReportActionContextMenuStyleUtils");
const TooltipStyleUtils_1 = require("./generators/TooltipStyleUtils");
const getContextMenuItemStyles_1 = require("./getContextMenuItemStyles");
const getHighResolutionInfoWrapperStyle_1 = require("./getHighResolutionInfoWrapperStyle");
const getMoneyRequestReportPreviewStyle_1 = require("./getMoneyRequestReportPreviewStyle");
const index_1 = require("./getNavigationBarType/index");
const getNavigationModalCardStyles_1 = require("./getNavigationModalCardStyles");
const getSafeAreaInsets_1 = require("./getSafeAreaInsets");
const getSignInBgStyles_1 = require("./getSignInBgStyles");
const getSuccessReportCardLostIllustrationStyle_1 = require("./getSuccessReportCardLostIllustrationStyle");
const optionRowStyles_1 = require("./optionRowStyles");
const positioning_1 = require("./positioning");
const searchHeaderDefaultOffset_1 = require("./searchHeaderDefaultOffset");
const searchPageNarrowHeaderStyles_1 = require("./searchPageNarrowHeaderStyles");
const workspaceColorOptions = [
    { backgroundColor: colors_1.default.blue200, fill: colors_1.default.blue700 },
    { backgroundColor: colors_1.default.blue400, fill: colors_1.default.blue800 },
    { backgroundColor: colors_1.default.blue700, fill: colors_1.default.blue200 },
    { backgroundColor: colors_1.default.green200, fill: colors_1.default.green700 },
    { backgroundColor: colors_1.default.green400, fill: colors_1.default.green800 },
    { backgroundColor: colors_1.default.green700, fill: colors_1.default.green200 },
    { backgroundColor: colors_1.default.yellow200, fill: colors_1.default.yellow700 },
    { backgroundColor: colors_1.default.yellow400, fill: colors_1.default.yellow800 },
    { backgroundColor: colors_1.default.yellow700, fill: colors_1.default.yellow200 },
    { backgroundColor: colors_1.default.tangerine200, fill: colors_1.default.tangerine700 },
    { backgroundColor: colors_1.default.tangerine400, fill: colors_1.default.tangerine800 },
    { backgroundColor: colors_1.default.tangerine700, fill: colors_1.default.tangerine400 },
    { backgroundColor: colors_1.default.pink200, fill: colors_1.default.pink700 },
    { backgroundColor: colors_1.default.pink400, fill: colors_1.default.pink800 },
    { backgroundColor: colors_1.default.pink700, fill: colors_1.default.pink200 },
    { backgroundColor: colors_1.default.ice200, fill: colors_1.default.ice700 },
    { backgroundColor: colors_1.default.ice400, fill: colors_1.default.ice800 },
    { backgroundColor: colors_1.default.ice700, fill: colors_1.default.ice200 },
];
const eReceiptColorStyles = {
    [CONST_1.default.ERECEIPT_COLORS.YELLOW]: { backgroundColor: colors_1.default.yellow800, color: colors_1.default.yellow400, titleColor: colors_1.default.yellow500 },
    [CONST_1.default.ERECEIPT_COLORS.ICE]: { backgroundColor: colors_1.default.ice800, color: colors_1.default.ice400, titleColor: colors_1.default.ice500 },
    [CONST_1.default.ERECEIPT_COLORS.BLUE]: { backgroundColor: colors_1.default.blue800, color: colors_1.default.blue400, titleColor: colors_1.default.blue500 },
    [CONST_1.default.ERECEIPT_COLORS.GREEN]: { backgroundColor: colors_1.default.green800, color: colors_1.default.green400, titleColor: colors_1.default.green500 },
    [CONST_1.default.ERECEIPT_COLORS.TANGERINE]: { backgroundColor: colors_1.default.tangerine800, color: colors_1.default.tangerine400, titleColor: colors_1.default.tangerine500 },
    [CONST_1.default.ERECEIPT_COLORS.PINK]: { backgroundColor: colors_1.default.pink800, color: colors_1.default.pink400, titleColor: colors_1.default.pink500 },
};
const eReceiptColors = [
    CONST_1.default.ERECEIPT_COLORS.YELLOW,
    CONST_1.default.ERECEIPT_COLORS.ICE,
    CONST_1.default.ERECEIPT_COLORS.BLUE,
    CONST_1.default.ERECEIPT_COLORS.GREEN,
    CONST_1.default.ERECEIPT_COLORS.TANGERINE,
    CONST_1.default.ERECEIPT_COLORS.PINK,
];
const avatarBorderSizes = {
    [CONST_1.default.AVATAR_SIZE.SMALL_SUBSCRIPT]: variables_1.default.componentBorderRadiusSmall,
    [CONST_1.default.AVATAR_SIZE.MID_SUBSCRIPT]: variables_1.default.componentBorderRadiusSmall,
    [CONST_1.default.AVATAR_SIZE.SUBSCRIPT]: variables_1.default.componentBorderRadiusMedium,
    [CONST_1.default.AVATAR_SIZE.SMALLER]: variables_1.default.componentBorderRadiusMedium,
    [CONST_1.default.AVATAR_SIZE.SMALL]: variables_1.default.componentBorderRadiusMedium,
    [CONST_1.default.AVATAR_SIZE.HEADER]: variables_1.default.componentBorderRadiusNormal,
    [CONST_1.default.AVATAR_SIZE.DEFAULT]: variables_1.default.componentBorderRadiusNormal,
    [CONST_1.default.AVATAR_SIZE.MEDIUM]: variables_1.default.componentBorderRadiusLarge,
    [CONST_1.default.AVATAR_SIZE.LARGE]: variables_1.default.componentBorderRadiusLarge,
    [CONST_1.default.AVATAR_SIZE.X_LARGE]: variables_1.default.componentBorderRadiusLarge,
    [CONST_1.default.AVATAR_SIZE.MEDIUM_LARGE]: variables_1.default.componentBorderRadiusLarge,
    [CONST_1.default.AVATAR_SIZE.LARGE_BORDERED]: variables_1.default.componentBorderRadiusRounded,
    [CONST_1.default.AVATAR_SIZE.SMALL_NORMAL]: variables_1.default.componentBorderRadiusMedium,
};
const avatarSizes = {
    [CONST_1.default.AVATAR_SIZE.DEFAULT]: variables_1.default.avatarSizeNormal,
    [CONST_1.default.AVATAR_SIZE.SMALL_SUBSCRIPT]: variables_1.default.avatarSizeSmallSubscript,
    [CONST_1.default.AVATAR_SIZE.MID_SUBSCRIPT]: variables_1.default.avatarSizeMidSubscript,
    [CONST_1.default.AVATAR_SIZE.SUBSCRIPT]: variables_1.default.avatarSizeSubscript,
    [CONST_1.default.AVATAR_SIZE.SMALL]: variables_1.default.avatarSizeSmall,
    [CONST_1.default.AVATAR_SIZE.SMALLER]: variables_1.default.avatarSizeSmaller,
    [CONST_1.default.AVATAR_SIZE.LARGE]: variables_1.default.avatarSizeLarge,
    [CONST_1.default.AVATAR_SIZE.X_LARGE]: variables_1.default.avatarSizeXLarge,
    [CONST_1.default.AVATAR_SIZE.MEDIUM]: variables_1.default.avatarSizeMedium,
    [CONST_1.default.AVATAR_SIZE.LARGE_BORDERED]: variables_1.default.avatarSizeLargeBordered,
    [CONST_1.default.AVATAR_SIZE.MEDIUM_LARGE]: variables_1.default.avatarSizeMediumLarge,
    [CONST_1.default.AVATAR_SIZE.HEADER]: variables_1.default.avatarSizeHeader,
    [CONST_1.default.AVATAR_SIZE.MENTION_ICON]: variables_1.default.avatarSizeMentionIcon,
    [CONST_1.default.AVATAR_SIZE.SMALL_NORMAL]: variables_1.default.avatarSizeSmallNormal,
    [CONST_1.default.AVATAR_SIZE.LARGE_NORMAL]: variables_1.default.avatarSizeLargeNormal,
};
const avatarFontSizes = {
    [CONST_1.default.AVATAR_SIZE.DEFAULT]: variables_1.default.fontSizeNormal,
    [CONST_1.default.AVATAR_SIZE.SMALL_SUBSCRIPT]: variables_1.default.fontSizeExtraSmall,
    [CONST_1.default.AVATAR_SIZE.MID_SUBSCRIPT]: variables_1.default.fontSizeExtraSmall,
    [CONST_1.default.AVATAR_SIZE.SUBSCRIPT]: variables_1.default.fontSizeExtraSmall,
    [CONST_1.default.AVATAR_SIZE.SMALL]: variables_1.default.fontSizeSmall,
    [CONST_1.default.AVATAR_SIZE.SMALLER]: variables_1.default.fontSizeExtraSmall,
    [CONST_1.default.AVATAR_SIZE.LARGE]: variables_1.default.fontSizeXLarge,
    [CONST_1.default.AVATAR_SIZE.MEDIUM_LARGE]: variables_1.default.fontSizeXLarge,
    [CONST_1.default.AVATAR_SIZE.MEDIUM]: variables_1.default.fontSizeMedium,
    [CONST_1.default.AVATAR_SIZE.LARGE_BORDERED]: variables_1.default.fontSizeXLarge,
};
const avatarBorderWidths = {
    [CONST_1.default.AVATAR_SIZE.DEFAULT]: 3,
    [CONST_1.default.AVATAR_SIZE.SMALL_SUBSCRIPT]: 2,
    [CONST_1.default.AVATAR_SIZE.MID_SUBSCRIPT]: 2,
    [CONST_1.default.AVATAR_SIZE.SUBSCRIPT]: 2,
    [CONST_1.default.AVATAR_SIZE.SMALL]: 2,
    [CONST_1.default.AVATAR_SIZE.SMALLER]: 2,
    [CONST_1.default.AVATAR_SIZE.HEADER]: 2,
    [CONST_1.default.AVATAR_SIZE.LARGE]: 4,
    [CONST_1.default.AVATAR_SIZE.MEDIUM_LARGE]: 3,
    [CONST_1.default.AVATAR_SIZE.X_LARGE]: 4,
    [CONST_1.default.AVATAR_SIZE.MEDIUM]: 3,
    [CONST_1.default.AVATAR_SIZE.LARGE_BORDERED]: 4,
};
/**
 * Converts a color in hexadecimal notation into RGB notation.
 *
 * @param hexadecimal A color in hexadecimal notation.
 * @returns `undefined` if the input color is not in hexadecimal notation. Otherwise, the RGB components of the input color.
 */
function hexadecimalToRGBArray(hexadecimal) {
    const components = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexadecimal);
    if (components === null) {
        return undefined;
    }
    return components.slice(1).map((component) => parseInt(component, 16));
}
/**
 * Converts a color in RGBA notation to an equivalent color in RGB notation.
 *
 * @param foregroundRGB The three components of the foreground color in RGB notation.
 * @param backgroundRGB The three components of the background color in RGB notation.
 * @param opacity The desired opacity of the foreground color.
 * @returns The RGB components of the RGBA color converted to RGB.
 */
function convertRGBAToRGB(foregroundRGB, backgroundRGB, opacity) {
    const [foregroundRed, foregroundGreen, foregroundBlue] = foregroundRGB;
    const [backgroundRed, backgroundGreen, backgroundBlue] = backgroundRGB;
    return [(1 - opacity) * backgroundRed + opacity * foregroundRed, (1 - opacity) * backgroundGreen + opacity * foregroundGreen, (1 - opacity) * backgroundBlue + opacity * foregroundBlue];
}
/**
 * Converts three unit values to the three components of a color in RGB notation.
 *
 * @param red A unit value representing the first component of a color in RGB notation.
 * @param green A unit value representing the second component of a color in RGB notation.
 * @param blue A unit value representing the third component of a color in RGB notation.
 * @returns An array with the three components of a color in RGB notation.
 */
function convertUnitValuesToRGB(red, green, blue) {
    return [Math.floor(red * 255), Math.floor(green * 255), Math.floor(blue * 255)];
}
/**
 * Converts the three components of a color in RGB notation to three unit values.
 *
 * @param red The first component of a color in RGB notation.
 * @param green The second component of a color in RGB notation.
 * @param blue The third component of a color in RGB notation.
 * @returns An array with three unit values representing the components of a color in RGB notation.
 */
function convertRGBToUnitValues(red, green, blue) {
    return [red / 255, green / 255, blue / 255];
}
/**
 * Matches an RGBA or RGB color value and extracts the color components.
 *
 * @param color - The RGBA or RGB color value to match and extract components from.
 * @returns An array containing the extracted color components [red, green, blue, alpha].
 *
 * Returns null if the input string does not match the pattern.
 */
function extractValuesFromRGB(color) {
    const rgbaPattern = /rgba?\((?<r>[.\d]+)[, ]+(?<g>[.\d]+)[, ]+(?<b>[.\d]+)(?:\s?[,/]\s?(?<a>[.\d]+%?))?\)$/i;
    const matchRGBA = color.match(rgbaPattern);
    if (matchRGBA) {
        const [, red, green, blue, alpha] = matchRGBA;
        return [parseInt(red, 10), parseInt(green, 10), parseInt(blue, 10), alpha ? parseFloat(alpha) : 1];
    }
    return null;
}
/**
 * Return the style size from an avatar size constant
 */
function getAvatarSize(size) {
    return avatarSizes[size];
}
/**
 * Return the width style from an avatar size constant
 */
function getAvatarWidthStyle(size) {
    const avatarSize = getAvatarSize(size);
    return {
        width: avatarSize,
    };
}
/**
 * Get Font size of '+1' text on avatar overlay
 */
function getAvatarExtraFontSizeStyle(size) {
    return {
        fontSize: avatarFontSizes[size],
    };
}
/**
 * Get border size of Avatar based on avatar size
 */
function getAvatarBorderWidth(size) {
    return {
        borderWidth: avatarBorderWidths[size],
    };
}
/**
 * Return the border radius for an avatar
 */
function getAvatarBorderRadius(size, type) {
    if (type === CONST_1.default.ICON_TYPE_WORKSPACE) {
        return { borderRadius: avatarBorderSizes[size] };
    }
    // Default to rounded border
    return { borderRadius: variables_1.default.buttonBorderRadius };
}
/**
 * Return the border style for an avatar
 */
function getAvatarBorderStyle(size, type) {
    return {
        overflow: 'hidden',
        ...getAvatarBorderRadius(size, type),
    };
}
/**
 * Returns the avatar subscript icon container styles
 */
function getAvatarSubscriptIconContainerStyle(iconWidth = 16, iconHeight = 16) {
    const borderWidth = 2;
    // The width of the container is the width of the icon + 2x border width (left and right)
    const containerWidth = iconWidth + 2 * borderWidth;
    // The height of the container is the height of the icon + 2x border width (top and bottom)
    const containerHeight = iconHeight + 2 * borderWidth;
    return {
        overflow: 'hidden',
        position: 'absolute',
        bottom: -4,
        right: -4,
        borderWidth,
        borderRadius: 2 + borderWidth,
        width: containerWidth,
        height: containerHeight,
    };
}
/**
 * Helper method to return workspace avatar color styles
 */
function getDefaultWorkspaceAvatarColor(text) {
    const colorHash = (0, UserUtils_1.hashText)(text.trim(), workspaceColorOptions.length);
    return workspaceColorOptions.at(colorHash) ?? { backgroundColor: colors_1.default.blue200, fill: colors_1.default.blue700 };
}
/**
 * Helper method to return formatted backgroundColor and fill styles
 */
function getBackgroundColorAndFill(backgroundColor, fill) {
    return { backgroundColor, fill };
}
/**
 * Helper method to return eReceipt color code
 */
function getEReceiptColorCode(transaction) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const transactionID = transaction?.parentTransactionID || transaction?.transactionID;
    if (!transactionID) {
        return CONST_1.default.ERECEIPT_COLORS.YELLOW;
    }
    const colorHash = (0, UserUtils_1.hashText)(transactionID.trim(), eReceiptColors.length);
    return eReceiptColors.at(colorHash) ?? CONST_1.default.ERECEIPT_COLORS.YELLOW;
}
/**
 * Helper method to return eReceipt color code for Receipt Thumbnails
 */
function getFileExtensionColorCode(fileExtension) {
    switch (fileExtension) {
        case CONST_1.default.IOU.FILE_TYPES.DOC:
            return CONST_1.default.ERECEIPT_COLORS.PINK;
        case CONST_1.default.IOU.FILE_TYPES.HTML:
            return CONST_1.default.ERECEIPT_COLORS.TANGERINE;
        default:
            return CONST_1.default.ERECEIPT_COLORS.GREEN;
    }
}
/**
 * Helper method to return eReceipt color styles
 */
function getEReceiptColorStyles(colorCode) {
    return eReceiptColorStyles[colorCode];
}
/**
 * Takes safe area insets and returns platform specific padding to use for a View
 */
function getPlatformSafeAreaPadding(insets, insetsPercentageProp) {
    const platform = (0, getPlatform_1.default)();
    let insetsPercentage = insetsPercentageProp;
    if (insetsPercentage == null) {
        switch (platform) {
            case CONST_1.default.PLATFORM.IOS:
                insetsPercentage = variables_1.default.iosSafeAreaInsetsPercentage;
                break;
            case CONST_1.default.PLATFORM.ANDROID:
                insetsPercentage = variables_1.default.androidSafeAreaInsetsPercentage;
                break;
            default:
                insetsPercentage = 1;
        }
    }
    return {
        paddingTop: insets?.top ?? 0,
        paddingBottom: (insets?.bottom ?? 0) * insetsPercentage,
        paddingLeft: (insets?.left ?? 0) * insetsPercentage,
        paddingRight: (insets?.right ?? 0) * insetsPercentage,
    };
}
/**
 * Takes safe area insets and returns margin to use for a View
 */
function getSafeAreaMargins(insets) {
    return { marginBottom: (insets?.bottom ?? 0) * variables_1.default.iosSafeAreaInsetsPercentage };
}
function getZoomSizingStyle(isZoomed, imgWidth, imgHeight, zoomScale, containerHeight, containerWidth, isLoading) {
    // Hide image until finished loading to prevent showing preview with wrong dimensions
    if (isLoading || imgWidth === 0 || imgHeight === 0) {
        return undefined;
    }
    const top = `${Math.max((containerHeight - imgHeight) / 2, 0)}px`;
    const left = `${Math.max((containerWidth - imgWidth) / 2, 0)}px`;
    // Return different size and offset style based on zoomScale and isZoom.
    if (isZoomed) {
        // When both width and height are smaller than container(modal) size, set the height by multiplying zoomScale if it is zoomed in.
        if (zoomScale >= 1) {
            return {
                height: `${imgHeight * zoomScale}px`,
                width: `${imgWidth * zoomScale}px`,
            };
        }
        // If image height and width are bigger than container size, display image with original size because original size is bigger and position absolute.
        return {
            height: `${imgHeight}px`,
            width: `${imgWidth}px`,
            top,
            left,
        };
    }
    // If image is not zoomed in and image size is smaller than container size, display with original size based on offset and position absolute.
    if (zoomScale > 1) {
        return {
            height: `${imgHeight}px`,
            width: `${imgWidth}px`,
            top,
            left,
        };
    }
    // If image is bigger than container size, display full image in the screen with scaled size (fit by container size) and position absolute.
    // top, left offset should be different when displaying long or wide image.
    const scaledTop = `${Math.max((containerHeight - imgHeight * zoomScale) / 2, 0)}px`;
    const scaledLeft = `${Math.max((containerWidth - imgWidth * zoomScale) / 2, 0)}px`;
    return {
        height: `${imgHeight * zoomScale}px`,
        width: `${imgWidth * zoomScale}px`,
        top: scaledTop,
        left: scaledLeft,
    };
}
/**
 * Returns a style with width set to the specified number
 */
function getWidthStyle(width) {
    return {
        width,
    };
}
/**
 * Returns a style with border radius set to the specified number
 */
function getBorderRadiusStyle(borderRadius) {
    return {
        borderRadius,
    };
}
/**
 * Returns a style with backgroundColor and borderColor set to the same color
 */
function getBackgroundAndBorderStyle(backgroundColor) {
    return {
        backgroundColor,
        borderColor: backgroundColor,
    };
}
/**
 * Returns a style with the specified backgroundColor
 */
function getBackgroundColorStyle(backgroundColor) {
    return {
        backgroundColor,
    };
}
/**
 * Returns a style for text color
 */
function getTextColorStyle(color) {
    return {
        color,
    };
}
/**
 * Returns a style with the specified borderColor
 */
function getBorderColorStyle(borderColor) {
    return {
        borderColor,
    };
}
/**
 * Returns the width style for the wordmark logo on the sign in page
 */
function getSignInWordmarkWidthStyle(isSmallScreenWidth, environment) {
    if (environment === CONST_1.default.ENVIRONMENT.DEV) {
        return isSmallScreenWidth ? { width: variables_1.default.signInLogoWidthPill } : { width: variables_1.default.signInLogoWidthLargeScreenPill };
    }
    if (environment === CONST_1.default.ENVIRONMENT.STAGING) {
        return isSmallScreenWidth ? { width: variables_1.default.signInLogoWidthPill } : { width: variables_1.default.signInLogoWidthLargeScreenPill };
    }
    if (environment === CONST_1.default.ENVIRONMENT.PRODUCTION) {
        return isSmallScreenWidth ? { width: variables_1.default.signInLogoWidth } : { width: variables_1.default.signInLogoWidthLargeScreen };
    }
    return isSmallScreenWidth ? { width: variables_1.default.signInLogoWidthPill } : { width: variables_1.default.signInLogoWidthLargeScreenPill };
}
/**
 * Returns a background color with opacity style
 */
function getBackgroundColorWithOpacityStyle(backgroundColor, opacity) {
    const result = hexadecimalToRGBArray(backgroundColor);
    if (result !== undefined) {
        return {
            backgroundColor: `rgba(${result.at(0)}, ${result.at(1)}, ${result.at(2)}, ${opacity})`,
        };
    }
    return {};
}
function getWidthAndHeightStyle(width, height) {
    return {
        width,
        height: height ?? width,
    };
}
function getIconWidthAndHeightStyle(small, medium, large, width, height, isButtonIcon) {
    switch (true) {
        case small:
            return { width: isButtonIcon ? variables_1.default.iconSizeExtraSmall : variables_1.default.iconSizeSmall, height: isButtonIcon ? variables_1.default.iconSizeExtraSmall : variables_1.default?.iconSizeSmall };
        case medium:
            return { width: isButtonIcon ? variables_1.default.iconSizeSmall : variables_1.default.iconSizeNormal, height: isButtonIcon ? variables_1.default.iconSizeSmall : variables_1.default.iconSizeNormal };
        case large:
            return { width: isButtonIcon ? variables_1.default.iconSizeNormal : variables_1.default.iconSizeLarge, height: isButtonIcon ? variables_1.default.iconSizeNormal : variables_1.default.iconSizeLarge };
        default: {
            return { width, height };
        }
    }
}
function getButtonStyleWithIcon(styles, small, medium, large, hasIcon, hasText, shouldShowRightIcon) {
    const useDefaultButtonStyles = !!(hasIcon && shouldShowRightIcon) || !!(!hasIcon && !shouldShowRightIcon);
    switch (true) {
        case small: {
            const verticalStyle = hasIcon ? styles.pl2 : styles.pr2;
            return useDefaultButtonStyles ? styles.buttonSmall : { ...styles.buttonSmall, ...(hasText ? verticalStyle : styles.ph0) };
        }
        case medium: {
            const verticalStyle = hasIcon ? styles.pl3 : styles.pr3;
            return useDefaultButtonStyles ? styles.buttonMedium : { ...styles.buttonMedium, ...(hasText ? verticalStyle : styles.ph0) };
        }
        case large: {
            const verticalStyle = hasIcon ? styles.pl4 : styles.pr4;
            return useDefaultButtonStyles ? styles.buttonLarge : { ...styles.buttonLarge, ...(hasText ? verticalStyle : styles.ph0) };
        }
        default: {
            if (hasIcon && !hasText) {
                return { ...styles.buttonMedium, ...styles.ph0 };
            }
            return undefined;
        }
    }
}
/**
 * Combine margin/padding with safe area inset
 *
 * @param modalContainerValue - margin or padding value
 * @param safeAreaValue - safe area inset
 * @param shouldAddSafeAreaValue - indicator whether safe area inset should be applied
 */
function getCombinedSpacing(modalContainerValue, safeAreaValue, shouldAddSafeAreaValue) {
    // modalContainerValue can only be added to safe area inset if it's a number, otherwise it's returned as is
    if (typeof modalContainerValue === 'number') {
        return modalContainerValue + (shouldAddSafeAreaValue ? safeAreaValue : 0);
    }
    if (!modalContainerValue) {
        return shouldAddSafeAreaValue ? safeAreaValue : 0;
    }
    return modalContainerValue;
}
function getModalPaddingStyles({ shouldAddBottomSafeAreaMargin, shouldAddTopSafeAreaMargin, shouldAddBottomSafeAreaPadding, shouldAddTopSafeAreaPadding, modalContainerStyle, insets, }) {
    const { paddingTop: safeAreaPaddingTop, paddingBottom: safeAreaPaddingBottom, paddingLeft: safeAreaPaddingLeft, paddingRight: safeAreaPaddingRight } = getPlatformSafeAreaPadding(insets);
    // use fallback value for safeAreaPaddingBottom to keep padding bottom consistent with padding top.
    // More info: issue #17376
    const safeAreaPaddingBottomWithFallback = insets.bottom === 0 && typeof modalContainerStyle.paddingTop === 'number' ? (modalContainerStyle.paddingTop ?? 0) : safeAreaPaddingBottom;
    return {
        marginTop: getCombinedSpacing(modalContainerStyle.marginTop, safeAreaPaddingTop, shouldAddTopSafeAreaMargin),
        marginBottom: getCombinedSpacing(modalContainerStyle.marginBottom, safeAreaPaddingBottomWithFallback, shouldAddBottomSafeAreaMargin),
        paddingTop: getCombinedSpacing(modalContainerStyle.paddingTop, safeAreaPaddingTop, shouldAddTopSafeAreaPadding),
        paddingBottom: getCombinedSpacing(modalContainerStyle.paddingBottom, safeAreaPaddingBottom, shouldAddBottomSafeAreaPadding),
        paddingLeft: safeAreaPaddingLeft ?? 0,
        paddingRight: safeAreaPaddingRight ?? 0,
    };
}
/**
 * Returns the font size for the HTML code tag renderer.
 */
function getCodeFontSize(isInsideH1, isInsideTaskTitle) {
    if (isInsideH1 && !isInsideTaskTitle) {
        return 15;
    }
    if (isInsideTaskTitle) {
        return 18;
    }
    return 13;
}
/**
 * Gives the width for Emoji picker Widget
 */
function getEmojiPickerStyle(isSmallScreenWidth) {
    if (isSmallScreenWidth) {
        return {
            width: CONST_1.default.SMALL_EMOJI_PICKER_SIZE.WIDTH,
        };
    }
    return {
        width: CONST_1.default.EMOJI_PICKER_SIZE.WIDTH,
        height: CONST_1.default.EMOJI_PICKER_SIZE.HEIGHT,
    };
}
function getPaymentMethodMenuWidth(isSmallScreenWidth) {
    const margin = 20;
    return { width: !isSmallScreenWidth ? variables_1.default.sideBarWidth - margin * 2 : undefined };
}
/**
 * Parse styleParam and return Styles array
 */
function parseStyleAsArray(styleParam) {
    return Array.isArray(styleParam) ? styleParam : [styleParam];
}
/**
 * Parse style function and return Styles object
 */
function parseStyleFromFunction(style, state) {
    return typeof style === 'function' ? style(state) : style;
}
/**
 * Receives any number of object or array style objects and returns them all as an array
 */
function combineStyles(...allStyles) {
    let finalStyles = [];
    allStyles.forEach((style) => {
        finalStyles = finalStyles.concat(parseStyleAsArray(style));
    });
    return finalStyles;
}
/**
 * Get variable padding-left as style
 */
function getPaddingLeft(paddingLeft) {
    return {
        paddingLeft,
    };
}
/**
 * Get variable padding-right as style
 */
function getPaddingRight(paddingRight) {
    return {
        paddingRight,
    };
}
/**
 * Get variable padding-bottom as style
 */
function getPaddingBottom(paddingBottom) {
    return {
        paddingBottom,
    };
}
/**
 * Get vertical padding diff from provided styles (paddingTop - paddingBottom)
 */
function getVerticalPaddingDiffFromStyle(textInputContainerStyles) {
    const flatStyle = react_native_1.StyleSheet.flatten(textInputContainerStyles);
    // Safely extract padding values only if they are numbers
    const getNumericPadding = (paddingValue) => {
        return typeof paddingValue === 'number' ? paddingValue : 0;
    };
    const paddingTop = getNumericPadding(flatStyle?.paddingTop ?? flatStyle.padding);
    const paddingBottom = getNumericPadding(flatStyle?.paddingBottom ?? flatStyle.padding);
    return paddingTop - paddingBottom;
}
/**
 * Checks to see if the iOS device has safe areas or not
 */
function hasSafeAreas(windowWidth, windowHeight) {
    const heightsIPhonesWithNotches = [812, 896, 844, 926];
    return heightsIPhonesWithNotches.includes(windowHeight) || heightsIPhonesWithNotches.includes(windowWidth);
}
/**
 * Get height as style
 */
function getHeight(height) {
    return {
        height,
    };
}
/**
 * Get minimum height as style
 */
function getMinimumHeight(minHeight) {
    return {
        minHeight,
    };
}
/**
 * Get minimum width as style
 */
function getMinimumWidth(minWidth) {
    return {
        minWidth,
    };
}
/**
 * Get maximum height as style
 */
function getMaximumHeight(maxHeight) {
    return {
        maxHeight,
    };
}
/**
 * Get maximum width as style
 */
function getMaximumWidth(maxWidth) {
    return {
        maxWidth,
    };
}
function getHorizontalStackedAvatarBorderStyle({ theme, isHovered, isPressed, isInReportAction = false, shouldUseCardBackground = false, isActive = false, }) {
    let borderColor = shouldUseCardBackground ? theme.cardBG : theme.appBG;
    if (isHovered) {
        borderColor = isInReportAction ? theme.hoverComponentBG : theme.border;
    }
    if (isActive) {
        borderColor = theme.messageHighlightBG;
    }
    if (isPressed) {
        borderColor = isInReportAction ? theme.hoverComponentBG : theme.buttonPressedBG;
    }
    return { borderColor };
}
/**
 * Get computed avatar styles based on position and border size
 */
function getHorizontalStackedAvatarStyle(index, overlapSize) {
    return {
        marginLeft: index > 0 ? -overlapSize : 0,
        zIndex: index + 2,
    };
}
/**
 * Get computed avatar styles of '+1' overlay based on size
 */
function getHorizontalStackedOverlayAvatarStyle(oneAvatarSize, oneAvatarBorderWidth) {
    return {
        borderWidth: oneAvatarBorderWidth,
        borderRadius: oneAvatarSize.width,
        marginLeft: -(oneAvatarSize.width + oneAvatarBorderWidth * 2),
        zIndex: 6,
        borderStyle: 'solid',
    };
}
/**
 * Gets the correct size for the empty state background image based on screen dimensions
 */
function getReportWelcomeBackgroundImageStyle(isSmallScreenWidth) {
    if (isSmallScreenWidth) {
        return {
            position: 'absolute',
            bottom: 0,
            height: CONST_1.default.EMPTY_STATE_BACKGROUND.SMALL_SCREEN.IMAGE_HEIGHT,
            width: '100%',
        };
    }
    return {
        position: 'absolute',
        bottom: 0,
        height: CONST_1.default.EMPTY_STATE_BACKGROUND.WIDE_SCREEN.IMAGE_HEIGHT,
        width: '100%',
    };
}
/**
 * Gets the style for the container of the empty state background image that overlap the created report action
 */
function getReportWelcomeBackgroundContainerStyle() {
    return {
        position: 'absolute',
        top: CONST_1.default.EMPTY_STATE_BACKGROUND.OVERLAP,
        width: '100%',
    };
}
/**
 * Returns fontSize style
 */
function getFontSizeStyle(fontSize) {
    return {
        fontSize,
    };
}
/**
 * Returns lineHeight style
 */
function getLineHeightStyle(lineHeight) {
    return {
        lineHeight,
    };
}
/**
 * Gets the correct position for the base auto complete suggestion container
 */
function getBaseAutoCompleteSuggestionContainerStyle({ left, bottom, width }) {
    return {
        position: 'absolute',
        bottom,
        left,
        width,
    };
}
const shouldPreventScroll = (0, autoCompleteSuggestion_1.default)();
/**
 * Gets the correct position for auto complete suggestion container
 */
function getAutoCompleteSuggestionContainerStyle(itemsHeight) {
    'worklet';
    const borderWidth = 2;
    const height = itemsHeight + 2 * CONST_1.default.AUTO_COMPLETE_SUGGESTER.SUGGESTER_INNER_PADDING + (shouldPreventScroll ? borderWidth : 0);
    return {
        height,
        minHeight: CONST_1.default.AUTO_COMPLETE_SUGGESTER.SUGGESTION_ROW_HEIGHT,
    };
}
function getEmojiReactionBubbleTextStyle(isContextMenu = false) {
    if (isContextMenu) {
        return {
            fontSize: 17,
            lineHeight: 24,
        };
    }
    return {
        fontSize: 15,
        lineHeight: 22,
    };
}
function getTransformScaleStyle(scaleValue) {
    return {
        transform: [{ scale: scaleValue }],
    };
}
/**
 * Returns a style object with a rotation transformation applied based on the provided direction prop.
 *
 * @param direction - The direction of the rotation (CONST.DIRECTION.LEFT or CONST.DIRECTION.RIGHT).
 */
function getDirectionStyle(direction) {
    if (direction === CONST_1.default.DIRECTION.LEFT) {
        return { transform: 'rotate(180deg)' };
    }
    return {};
}
/**
 * Returns a style object with display flex or none basing on the condition value.
 */
function displayIfTrue(condition) {
    return { display: condition ? 'flex' : 'none' };
}
/**
 * Gets the correct height for emoji picker list based on screen dimensions
 */
function getEmojiPickerListHeight(isRenderingShortcutRow, windowHeight) {
    const style = {
        height: isRenderingShortcutRow ? CONST_1.default.NON_NATIVE_EMOJI_PICKER_LIST_HEIGHT + CONST_1.default.CATEGORY_SHORTCUT_BAR_HEIGHT : CONST_1.default.NON_NATIVE_EMOJI_PICKER_LIST_HEIGHT,
    };
    if (windowHeight) {
        // dimensions of content above the emoji picker list
        const dimensions = isRenderingShortcutRow ? CONST_1.default.EMOJI_PICKER_TEXT_INPUT_SIZES + CONST_1.default.CATEGORY_SHORTCUT_BAR_HEIGHT : CONST_1.default.EMOJI_PICKER_TEXT_INPUT_SIZES;
        const maxHeight = windowHeight - dimensions;
        return {
            ...style,
            maxHeight,
            /**
             * On native platforms, `maxHeight` doesn't work as expected, so we manually
             * enforce the height by returning the smaller of the element's height or the
             * `maxHeight`, ensuring it doesn't exceed the maximum allowed.
             */
            height: Math.min(style.height, maxHeight),
        };
    }
    return style;
}
/**
 * Returns vertical padding based on number of lines.
 */
function getComposeTextAreaPadding(isComposerFullSize, textContainsOnlyEmojis) {
    let paddingTop = 8;
    let paddingBottom = 8;
    // Issue #26222: If isComposerFullSize paddingValue will always be 5 to prevent padding jumps when adding multiple lines.
    if (!isComposerFullSize) {
        paddingTop = 8;
        paddingBottom = 8;
    }
    // We need to reduce the top padding because emojis have a bigger font height.
    if (textContainsOnlyEmojis) {
        paddingTop = 3;
    }
    return { paddingTop, paddingBottom };
}
/**
 * Returns style object for the mobile on WEB
 */
function getOuterModalStyle(windowHeight, viewportOffsetTop) {
    return (0, Browser_1.isMobile)() ? { maxHeight: windowHeight, marginTop: viewportOffsetTop } : {};
}
/**
 * Returns style object for flexWrap depending on the screen size
 */
function getWrappingStyle(isExtraSmallScreenWidth) {
    return {
        flexWrap: isExtraSmallScreenWidth ? 'wrap' : 'nowrap',
    };
}
/**
 * Returns the text container styles for menu items depending on if the menu item container is in compact mode or not
 */
function getMenuItemTextContainerStyle(compactMode) {
    return {
        minHeight: compactMode ? 20 : variables_1.default.componentSizeNormal,
    };
}
/**
 * Returns the style for a menu item's icon based on of the container is in compact mode or not
 */
function getMenuItemIconStyle(compactMode) {
    return {
        justifyContent: 'center',
        alignItems: 'center',
        width: compactMode ? 20 : variables_1.default.componentSizeNormal,
    };
}
/**
 * Returns color style
 */
function getColorStyle(color) {
    return { color };
}
/**
 * Returns the checkbox pressable style
 */
function getCheckboxPressableStyle(borderRadius = 6) {
    return {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius,
    };
}
/**
 * Returns style object for the drop button height
 */
function getDropDownButtonHeight(buttonSize) {
    if (buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.LARGE) {
        return {
            height: variables_1.default.componentSizeLarge,
        };
    }
    if (buttonSize === CONST_1.default.DROPDOWN_BUTTON_SIZE.SMALL) {
        return {
            height: variables_1.default.componentSizeSmall,
        };
    }
    return {
        height: variables_1.default.componentSizeNormal,
    };
}
/**
 * Returns fitting fontSize and lineHeight values in order to prevent large amounts from being cut off on small screen widths.
 */
function getAmountFontSizeAndLineHeight(isSmallScreenWidth, windowWidth, displayAmountLength, numberOfParticipant) {
    let toSubtract = 0;
    const baseFontSize = variables_1.default.fontSizeXLarge;
    const baseLineHeight = variables_1.default.lineHeightXXLarge;
    const numberOfAvatar = numberOfParticipant < 4 ? numberOfParticipant : 4;
    const differentWithMaxLength = 17 - displayAmountLength;
    // with a window width is more than 420px the maximum amount will not be cut off with the maximum avatar displays
    if (isSmallScreenWidth && windowWidth < 420) {
        // Based on width Difference we can see the max length of amount can be displayed with the number of avatars.
        // From there we can calculate subtract in accordance with the number of avatar and the length of amount text
        const widthDifference = 420 - windowWidth;
        switch (true) {
            // It is very rare for native devices to have a width smaller than 350px so add a constant subtract here
            case widthDifference > 70:
                toSubtract = 11;
                break;
            case widthDifference > 60:
                if (18 - numberOfAvatar * 2 < displayAmountLength) {
                    toSubtract = numberOfAvatar * 2 - differentWithMaxLength;
                }
                break;
            case widthDifference > 50:
                if (19 - numberOfAvatar * 2 < displayAmountLength) {
                    toSubtract = (numberOfAvatar - 1) * 2 + 1 - differentWithMaxLength;
                }
                break;
            case widthDifference > 40:
                if (20 - numberOfAvatar * 2 < displayAmountLength) {
                    toSubtract = (numberOfAvatar - 1) * 2 - differentWithMaxLength;
                }
                break;
            case widthDifference > 30:
                if (21 - numberOfAvatar * 2 < displayAmountLength) {
                    toSubtract = (numberOfAvatar - 1) * 2 - 1 - differentWithMaxLength;
                }
                break;
            case widthDifference > 20:
                if (22 - numberOfAvatar * 2 < displayAmountLength) {
                    toSubtract = (numberOfAvatar - 2) * 2 - differentWithMaxLength;
                }
                break;
            default:
                if (displayAmountLength + numberOfAvatar === 21) {
                    toSubtract = 3;
                }
                break;
        }
    }
    return {
        fontSize: baseFontSize - toSubtract,
        lineHeight: baseLineHeight - toSubtract,
    };
}
/**
 * Get transparent color by setting alpha value 0 of the passed hex(#xxxxxx) color code
 */
function getTransparentColor(color) {
    return `${color}00`;
}
function getOpacityStyle(opacity) {
    return { opacity };
}
function getMultiGestureCanvasContainerStyle(canvasWidth) {
    return {
        width: canvasWidth,
        overflow: 'hidden',
    };
}
function percentage(percentageValue, totalValue) {
    return (totalValue / 100) * percentageValue;
}
/**
 * Calculates the width in px of characters from 0 to 9 and '.'
 */
function getCharacterWidth(character) {
    const defaultWidth = 8;
    if (character === '.') {
        return percentage(25, defaultWidth);
    }
    const number = +character;
    // The digit '1' is 62.5% smaller than the default width
    if (number === 1) {
        return percentage(62.5, defaultWidth);
    }
    if (number >= 2 && number <= 5) {
        return defaultWidth;
    }
    if (number === 7) {
        return percentage(87.5, defaultWidth);
    }
    if ((number >= 6 && number <= 9) || number === 0) {
        return percentage(112.5, defaultWidth);
    }
    return defaultWidth;
}
function getAmountWidth(amount) {
    let width = 0;
    for (let i = 0; i < amount.length; i++) {
        width += getCharacterWidth(amount.charAt(i));
    }
    return width;
}
/**
 * When the item is selected and disabled, we want selected item styles.
 * When the item is focused and disabled, we want disabled item styles.
 * Single true value will give result accordingly.
 */
function getItemBackgroundColorStyle(isSelected, isFocused, isDisabled, selectedBG, focusedBG) {
    if (isSelected) {
        return { backgroundColor: selectedBG };
    }
    if (isDisabled) {
        return { backgroundColor: undefined };
    }
    if (isFocused) {
        return { backgroundColor: focusedBG };
    }
    return {};
}
/**
 * In SettlementButton, when the list exceeds a certain number of items,
 * we don't want to apply padding to the container. Instead, we want only
 * the first last item to have spacing to create the effect of having more items in the list.
 */
function getOptionMargin(itemIndex, itemsLen) {
    if (itemIndex === itemsLen && itemsLen >= 5) {
        return { marginBottom: 16 };
    }
    if (itemIndex === 0 && itemsLen >= 5) {
        return { marginTop: 16 };
    }
    return {};
}
const staticStyleUtils = {
    positioning: positioning_1.default,
    searchHeaderDefaultOffset: searchHeaderDefaultOffset_1.default,
    combineStyles,
    displayIfTrue,
    getAmountFontSizeAndLineHeight,
    getAutoCompleteSuggestionContainerStyle,
    getAvatarBorderRadius,
    getAvatarBorderStyle,
    getAvatarBorderWidth,
    getAvatarExtraFontSizeStyle,
    getAvatarSize,
    getAvatarWidthStyle,
    getAvatarSubscriptIconContainerStyle,
    getBackgroundAndBorderStyle,
    getBackgroundColorStyle,
    getBackgroundColorWithOpacityStyle,
    getPaddingLeft,
    getPaddingRight,
    getPaddingBottom,
    getVerticalPaddingDiffFromStyle,
    hasSafeAreas,
    getHeight,
    getMinimumHeight,
    getMinimumWidth,
    getMaximumHeight,
    getMaximumWidth,
    getHorizontalStackedAvatarBorderStyle,
    getHorizontalStackedAvatarStyle,
    getHorizontalStackedOverlayAvatarStyle,
    getMoneyRequestReportPreviewStyle: getMoneyRequestReportPreviewStyle_1.default,
    getReportWelcomeBackgroundImageStyle,
    getReportWelcomeBackgroundContainerStyle,
    getBaseAutoCompleteSuggestionContainerStyle,
    getBorderColorStyle,
    getCheckboxPressableStyle,
    getComposeTextAreaPadding,
    getColorStyle,
    getDefaultWorkspaceAvatarColor,
    getBackgroundColorAndFill,
    getDirectionStyle,
    getDropDownButtonHeight,
    getEmojiPickerListHeight,
    getEmojiPickerStyle,
    getEmojiReactionBubbleTextStyle,
    getTransformScaleStyle,
    getCodeFontSize,
    getFontSizeStyle,
    getLineHeightStyle,
    getMenuItemTextContainerStyle,
    getMenuItemIconStyle,
    getModalPaddingStyles,
    getOuterModalStyle,
    getPaymentMethodMenuWidth,
    getSafeAreaInsets: getSafeAreaInsets_1.default,
    getSafeAreaMargins,
    getPlatformSafeAreaPadding,
    getSignInWordmarkWidthStyle,
    getTextColorStyle,
    getTransparentColor,
    getWidthAndHeightStyle,
    getWidthStyle,
    getWrappingStyle,
    getZoomSizingStyle,
    parseStyleAsArray,
    parseStyleFromFunction,
    getEReceiptColorStyles,
    getEReceiptColorCode,
    getFileExtensionColorCode,
    getNavigationModalCardStyle: getNavigationModalCardStyles_1.default,
    getCardStyles: cardStyles_1.default,
    getSearchPageNarrowHeaderStyles: searchPageNarrowHeaderStyles_1.default,
    getOpacityStyle,
    getMultiGestureCanvasContainerStyle,
    getSignInBgStyles: getSignInBgStyles_1.default,
    getIconWidthAndHeightStyle,
    getButtonStyleWithIcon,
    getCharacterWidth,
    getAmountWidth,
    getBorderRadiusStyle,
    getHighResolutionInfoWrapperStyle: getHighResolutionInfoWrapperStyle_1.default,
    getItemBackgroundColorStyle,
    getNavigationBarType: index_1.default,
    getSuccessReportCardLostIllustrationStyle: getSuccessReportCardLostIllustrationStyle_1.default,
    getOptionMargin,
};
const createStyleUtils = (theme, styles) => ({
    ...staticStyleUtils,
    ...(0, ModalStyleUtils_1.default)({ theme, styles }),
    ...(0, TooltipStyleUtils_1.default)({ theme, styles }),
    ...(0, ReportActionContextMenuStyleUtils_1.default)({ theme, styles }),
    getCompactContentContainerStyles: () => (0, optionRowStyles_1.compactContentContainerStyles)(styles),
    getContextMenuItemStyles: (windowWidth) => (0, getContextMenuItemStyles_1.default)(styles, windowWidth),
    getContainerComposeStyles: () => (0, containerComposeStyles_1.default)(styles),
    /**
     * Gets styles for AutoCompleteSuggestion row
     */
    getAutoCompleteSuggestionItemStyle: (highlightedEmojiIndex, rowHeight, isHovered, currentEmojiIndex) => {
        let backgroundColor;
        if (currentEmojiIndex === highlightedEmojiIndex) {
            backgroundColor = theme.activeComponentBG;
        }
        else if (isHovered) {
            backgroundColor = theme.hoverComponentBG;
        }
        return [
            {
                height: rowHeight,
                justifyContent: 'center',
            },
            backgroundColor
                ? {
                    backgroundColor,
                }
                : {},
        ];
    },
    /**
     * Returns auto grow height text input style
     */
    getAutoGrowHeightInputStyle: (textInputHeight, maxHeight) => {
        if (textInputHeight > maxHeight) {
            return {
                ...styles.pr0,
                ...styles.overflowAuto,
            };
        }
        return {
            ...styles.pr0,
            ...styles.overflowHidden,
            // maxHeight is not of the input only but the of the whole input container
            // which also includes the top padding and bottom border
            height: maxHeight - styles.textInputMultilineContainer.paddingTop - styles.textInputContainer.borderWidth * 2,
        };
    },
    /*
     * Returns styles for the text input container, with extraSpace allowing overflow without affecting the layout.
     */
    getAutoGrowWidthInputContainerStyles: (width, extraSpace, marginSide) => {
        if (!!width && !!extraSpace) {
            const marginKey = marginSide === 'left' ? 'marginLeft' : 'marginRight';
            return { [marginKey]: -extraSpace, width: width + extraSpace };
        }
        return { width };
    },
    /*
     * Returns the actual maxHeight of the auto-growing markdown text input.
     */
    getMarkdownMaxHeight: (maxAutoGrowHeight) => {
        // maxHeight is not of the input only but the of the whole input container
        // which also includes the top padding and bottom border
        return maxAutoGrowHeight ? { maxHeight: maxAutoGrowHeight - styles.textInputMultilineContainer.paddingTop - styles.textInputContainer.borderWidth * 2 } : {};
    },
    /**
     * Computes styles for the text input icon container.
     * Applies horizontal padding if requested, and sets the top margin based on padding difference.
     */
    getTextInputIconContainerStyles: (hasLabel, includePadding = true, verticalPaddingDiff = 0) => {
        const paddingStyle = includePadding ? { paddingHorizontal: 11 } : {};
        return {
            ...paddingStyle,
            marginTop: -(verticalPaddingDiff / 2),
            height: '100%',
            justifyContent: 'center',
        };
    },
    /**
     * Return the style from an avatar size constant
     */
    getAvatarStyle: (size) => {
        const avatarSize = getAvatarSize(size);
        return {
            height: avatarSize,
            width: avatarSize,
            borderRadius: avatarSize,
            backgroundColor: theme.border,
        };
    },
    /**
     * Generate a style for the background color of the Badge
     */
    getBadgeColorStyle: (isSuccess, isError, isPressed = false, isAdHoc = false) => {
        if (isSuccess) {
            if (isAdHoc) {
                return isPressed ? styles.badgeAdHocSuccessPressed : styles.badgeAdHocSuccess;
            }
            return isPressed ? styles.badgeSuccessPressed : styles.badgeSuccess;
        }
        if (isError) {
            return isPressed ? styles.badgeDangerPressed : styles.badgeDanger;
        }
        return {};
    },
    getIconColorStyle: (isSuccess, isError) => {
        if (isSuccess) {
            return theme.iconSuccessFill;
        }
        if (isError) {
            return theme.iconDangerFill;
        }
        return theme.icon;
    },
    getEnvironmentBadgeStyle: (isSuccess, isError, isAdhoc) => {
        if (isAdhoc) {
            return styles.badgeAdHocSuccess;
        }
        if (isSuccess) {
            return styles.badgeEnvironmentSuccess;
        }
        if (isError) {
            return styles.badgeEnvironmentDanger;
        }
        return {};
    },
    /**
     * Generate a style for the background color of the button, based on its current state.
     *
     * @param buttonState - One of {'default', 'hovered', 'pressed'}
     * @param isMenuItem - whether this button is apart of a list
     */
    getButtonBackgroundColorStyle: (buttonState = CONST_1.default.BUTTON_STATES.DEFAULT, isMenuItem = false) => {
        switch (buttonState) {
            case CONST_1.default.BUTTON_STATES.PRESSED:
                return isMenuItem ? { backgroundColor: theme.buttonHoveredBG } : { backgroundColor: theme.buttonPressedBG };
            case CONST_1.default.BUTTON_STATES.ACTIVE:
                return isMenuItem ? { backgroundColor: theme.border } : { backgroundColor: theme.buttonHoveredBG };
            case CONST_1.default.BUTTON_STATES.DISABLED:
            case CONST_1.default.BUTTON_STATES.DEFAULT:
            default:
                return {};
        }
    },
    /**
     * Returns the checkbox container style
     */
    getCheckboxContainerStyle: (size, borderRadius = 4) => ({
        backgroundColor: theme.componentBG,
        height: size,
        width: size,
        borderColor: theme.borderLighter,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius,
        margin: 2,
    }),
    /**
     * Select the correct color for text.
     */
    getColoredBackgroundStyle: (isColored) => ({ backgroundColor: isColored ? theme.mentionBG : undefined }),
    /**
     * Returns link styles based on whether the link is disabled or not
     */
    getDisabledLinkStyles: (isDisabled = false) => {
        const disabledLinkStyles = {
            color: theme.textSupporting,
            ...styles.cursorDisabled,
        };
        return {
            ...styles.link,
            ...(isDisabled ? disabledLinkStyles : {}),
        };
    },
    /**
     * Get the style for the AM and PM buttons in the TimePicker
     */
    getStatusAMandPMButtonStyle: (amPmValue) => {
        const computedStyleForAM = amPmValue !== CONST_1.default.TIME_PERIOD.AM ? { backgroundColor: theme.componentBG } : {};
        const computedStyleForPM = amPmValue !== CONST_1.default.TIME_PERIOD.PM ? { backgroundColor: theme.componentBG } : {};
        return {
            styleForAM: [styles.timePickerWidth72, computedStyleForAM],
            styleForPM: [styles.timePickerWidth72, computedStyleForPM],
        };
    },
    /**
     * Get the styles of the text next to dot indicators
     */
    getDotIndicatorTextStyles: (isErrorText = true) => (isErrorText ? { ...styles.offlineFeedback.text, color: styles.formError.color } : { ...styles.offlineFeedback.text }),
    getEmojiReactionBubbleStyle: (isHovered, hasUserReacted, isContextMenu = false) => {
        let backgroundColor = theme.border;
        if (isHovered) {
            backgroundColor = theme.buttonHoveredBG;
        }
        if (hasUserReacted) {
            backgroundColor = theme.reactionActiveBackground;
        }
        if (isContextMenu) {
            return {
                paddingVertical: 3,
                paddingHorizontal: 12,
                backgroundColor,
            };
        }
        return {
            paddingVertical: 2,
            paddingHorizontal: 8,
            backgroundColor,
        };
    },
    getEmojiReactionCounterTextStyle: (hasUserReacted) => {
        if (hasUserReacted) {
            return { color: theme.reactionActiveText };
        }
        return { color: theme.text };
    },
    getErrorPageContainerStyle: (safeAreaPaddingBottom = 0) => ({
        backgroundColor: theme.componentBG,
        paddingBottom: 40 + safeAreaPaddingBottom,
    }),
    getGoogleListViewStyle: (shouldDisplayBorder) => {
        if (shouldDisplayBorder) {
            return {
                ...styles.borderTopRounded,
                ...styles.borderBottomRounded,
                marginTop: 4,
                paddingVertical: 6,
            };
        }
        return {
            transform: 'scale(0)',
        };
    },
    /**
     * Return the height of magic code input container
     */
    getHeightOfMagicCodeInput: () => ({ height: styles.magicCodeInputContainer.height - styles.textInputContainer.borderWidth * 2 }),
    /**
     * Generate fill color of an icon based on its state.
     *
     * @param buttonState - One of {'default', 'hovered', 'pressed'}
     * @param isMenuIcon - whether this icon is apart of a list
     * @param isPane - whether this icon is in a pane, e.g. Account or Workspace Settings
     */
    getIconFillColor: (buttonState = CONST_1.default.BUTTON_STATES.DEFAULT, isMenuIcon = false, isPane = false) => {
        switch (buttonState) {
            case CONST_1.default.BUTTON_STATES.ACTIVE:
            case CONST_1.default.BUTTON_STATES.PRESSED:
                if (isPane) {
                    return theme.iconMenu;
                }
                return theme.iconHovered;
            case CONST_1.default.BUTTON_STATES.COMPLETE:
                return theme.iconSuccessFill;
            case CONST_1.default.BUTTON_STATES.DEFAULT:
            case CONST_1.default.BUTTON_STATES.DISABLED:
            default:
                if (isMenuIcon && !isPane) {
                    return theme.iconMenu;
                }
                return theme.icon;
        }
    },
    /**
     * Returns style object for the user mention component based on whether the mention is ours or not.
     */
    getMentionStyle: (isOurMention) => {
        const backgroundColor = isOurMention ? theme.ourMentionBG : theme.mentionBG;
        return {
            backgroundColor,
            borderRadius: variables_1.default.componentBorderRadiusSmall,
            paddingHorizontal: 2,
        };
    },
    /**
     * Returns text color for the user mention text based on whether the mention is ours or not.
     */
    getMentionTextColor: (isOurMention) => (isOurMention ? theme.ourMentionText : theme.mentionText),
    /**
     * Generate the wrapper styles for the mini ReportActionContextMenu.
     */
    getMiniReportActionContextMenuWrapperStyle: (isReportActionItemGrouped) => ({
        ...(isReportActionItemGrouped ? positioning_1.default.tn8 : positioning_1.default.tn4),
        ...positioning_1.default.r4,
        ...styles.cursorDefault,
        ...styles.userSelectNone,
        overflowAnchor: 'none',
        position: 'absolute',
        zIndex: 8,
    }),
    /**
     * Generate the styles for the ReportActionItem wrapper view.
     */
    getReportActionItemStyle: (isHovered = false, isClickable = false) => ({
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: isHovered
            ? theme.hoverComponentBG
            : // Warning: Setting this to a non-transparent color will cause unread indicator to break on Android
                theme.transparent,
        opacity: 1,
        ...(isClickable ? styles.cursorPointer : styles.cursorInitial),
    }),
    /**
     * Determines the theme color for a modal based on the app's background color,
     * the modal's backdrop, and the backdrop's opacity.
     *
     * @param bgColor - theme background color
     * @returns The theme color as an RGB value.
     */
    getThemeBackgroundColor: (bgColor) => {
        const backdropOpacity = variables_1.default.overlayOpacity;
        const [backgroundRed, backgroundGreen, backgroundBlue] = extractValuesFromRGB(bgColor) ?? hexadecimalToRGBArray(bgColor) ?? [];
        const [backdropRed, backdropGreen, backdropBlue] = hexadecimalToRGBArray(theme.overlay) ?? [];
        const normalizedBackdropRGB = convertRGBToUnitValues(backdropRed, backdropGreen, backdropBlue);
        const normalizedBackgroundRGB = convertRGBToUnitValues(backgroundRed, backgroundGreen, backgroundBlue);
        const [red, green, blue] = convertRGBAToRGB(normalizedBackdropRGB, normalizedBackgroundRGB, backdropOpacity);
        const themeRGB = convertUnitValuesToRGB(red, green, blue);
        return `rgb(${themeRGB.join(', ')})`;
    },
    getZoomCursorStyle: (isZoomed, isDragging) => {
        if (!isZoomed) {
            return styles.cursorZoomIn;
        }
        return isDragging ? styles.cursorGrabbing : styles.cursorZoomOut;
    },
    getReportTableColumnStyles: (columnName, isDateColumnWide = false, isAmountColumnWide = false, isTaxAmountColumnWide = false, isDateColumnFullWidth = false) => {
        let columnWidth;
        switch (columnName) {
            case CONST_1.default.REPORT.TRANSACTION_LIST.COLUMNS.COMMENTS:
            case CONST_1.default.SEARCH.TABLE_COLUMNS.RECEIPT:
                columnWidth = { ...getWidthStyle(variables_1.default.w36), ...styles.alignItemsCenter };
                break;
            case CONST_1.default.SEARCH.TABLE_COLUMNS.DATE:
                if (isDateColumnFullWidth) {
                    columnWidth = styles.flex1;
                    break;
                }
                columnWidth = { ...getWidthStyle(isDateColumnWide ? variables_1.default.w92 : variables_1.default.w52) };
                break;
            case CONST_1.default.SEARCH.TABLE_COLUMNS.MERCHANT:
            case CONST_1.default.SEARCH.TABLE_COLUMNS.FROM:
            case CONST_1.default.SEARCH.TABLE_COLUMNS.TO:
            case CONST_1.default.SEARCH.TABLE_COLUMNS.ASSIGNEE:
            case CONST_1.default.SEARCH.TABLE_COLUMNS.TITLE:
            case CONST_1.default.SEARCH.TABLE_COLUMNS.DESCRIPTION:
            case CONST_1.default.SEARCH.TABLE_COLUMNS.IN:
                columnWidth = styles.flex1;
                break;
            case CONST_1.default.SEARCH.TABLE_COLUMNS.CATEGORY:
            case CONST_1.default.SEARCH.TABLE_COLUMNS.TAG:
                columnWidth = { ...getWidthStyle(variables_1.default.w36), ...styles.flex1 };
                break;
            case CONST_1.default.SEARCH.TABLE_COLUMNS.TAX_AMOUNT:
                columnWidth = { ...getWidthStyle(isTaxAmountColumnWide ? variables_1.default.w130 : variables_1.default.w96), ...styles.alignItemsEnd };
                break;
            case CONST_1.default.SEARCH.TABLE_COLUMNS.TOTAL_AMOUNT:
                columnWidth = { ...getWidthStyle(isAmountColumnWide ? variables_1.default.w130 : variables_1.default.w96), ...styles.alignItemsEnd };
                break;
            case CONST_1.default.SEARCH.TABLE_COLUMNS.TYPE:
                columnWidth = { ...getWidthStyle(variables_1.default.w20), ...styles.alignItemsCenter };
                break;
            case CONST_1.default.SEARCH.TABLE_COLUMNS.ACTION:
                columnWidth = { ...getWidthStyle(variables_1.default.w80), ...styles.alignItemsCenter };
                break;
            default:
                columnWidth = styles.flex1;
        }
        return columnWidth;
    },
    getTextOverflowStyle: (overflow) => ({
        textOverflow: overflow,
    }),
    /**
     * Returns container styles for showing the icons in MultipleAvatars/SubscriptAvatar
     */
    getContainerStyles: (size, isInReportAction = false) => {
        let containerStyles;
        switch (size) {
            case CONST_1.default.AVATAR_SIZE.SMALL:
                containerStyles = [styles.emptyAvatarSmall, styles.emptyAvatarMarginSmall];
                break;
            case CONST_1.default.AVATAR_SIZE.SMALLER:
                containerStyles = [styles.emptyAvatarSmaller, styles.emptyAvatarMarginSmaller];
                break;
            case CONST_1.default.AVATAR_SIZE.MEDIUM:
                containerStyles = [styles.emptyAvatarMedium, styles.emptyAvatarMargin];
                break;
            case CONST_1.default.AVATAR_SIZE.LARGE:
                containerStyles = [styles.emptyAvatarLarge, styles.mb2, styles.mr2];
                break;
            case CONST_1.default.AVATAR_SIZE.X_LARGE:
                containerStyles = [styles.emptyAvatarXLarge, styles.mb3, styles.mr3];
                break;
            default:
                containerStyles = [styles.emptyAvatar, isInReportAction ? styles.emptyAvatarMarginChat : styles.emptyAvatarMargin];
        }
        return containerStyles;
    },
    getUpdateRequiredViewStyles: (isSmallScreenWidth) => [
        {
            alignItems: 'center',
            justifyContent: 'center',
            ...(isSmallScreenWidth ? {} : styles.pb40),
        },
    ],
    /**
     * Returns a style that sets the maximum height of the composer based on the number of lines and whether the composer is full size or not.
     */
    getComposerMaxHeightStyle: (maxLines, isComposerFullSize) => {
        if (isComposerFullSize || maxLines == null) {
            return {};
        }
        const composerLineHeight = styles.textInputCompose.lineHeight ?? 0;
        return {
            maxHeight: maxLines * composerLineHeight,
        };
    },
    getFullscreenCenteredContentStyles: () => [react_native_1.StyleSheet.absoluteFill, styles.justifyContentCenter, styles.alignItemsCenter],
    /**
     * Returns the styles for the Tools modal
     */
    getTestToolsModalStyle: (windowWidth) => [styles.settingsPageBody, styles.p5, { width: windowWidth * 0.9 }],
    getMultiselectListStyles: (isSelected, isDisabled) => ({
        ...(isSelected && styles.checkedContainer),
        ...(isSelected && styles.borderColorFocus),
        ...(isDisabled && styles.cursorDisabled),
        ...(isDisabled && styles.buttonOpacityDisabled),
    }),
    /**
     * When adding a new prefix character, adjust this method to add expected character width.
     * This is because character width isn't known before it's rendered to the screen, and once it's rendered,
     * it's too late to calculate it's width because the change in padding would cause a visible jump.
     * Some characters are wider than the others when rendered, e.g. '@' vs '#'. Chosen font-family and font-size
     * also have an impact on the width of the character, but as long as there's only one font-family and one font-size,
     * this method will produce reliable results.
     */
    getCharacterPadding: (prefix) => {
        let padding = 0;
        prefix.split('').forEach((char) => {
            if (char.match(/[a-z]/i) && char === char.toUpperCase()) {
                padding += 11;
            }
            else {
                padding += 8;
            }
        });
        return padding;
    },
    // TODO: remove it when we'll implement the callback to handle this toggle in Expensify/Expensify#368335
    getWorkspaceWorkflowsOfflineDescriptionStyle: (descriptionTextStyle) => ({
        ...react_native_1.StyleSheet.flatten(descriptionTextStyle),
        opacity: styles.opacitySemiTransparent.opacity,
    }),
    getTripReservationIconContainer: (isSmallIcon) => ({
        width: isSmallIcon ? variables_1.default.avatarSizeSmallNormal : variables_1.default.avatarSizeNormal,
        height: isSmallIcon ? variables_1.default.avatarSizeSmallNormal : variables_1.default.avatarSizeNormal,
        borderRadius: isSmallIcon ? variables_1.default.avatarSizeSmallNormal : variables_1.default.componentBorderRadiusXLarge,
        backgroundColor: theme.border,
        alignItems: 'center',
        justifyContent: 'center',
    }),
    getTaskPreviewIconWrapper: (avatarSize) => ({
        height: avatarSize ? getAvatarSize(avatarSize) : variables_1.default.fontSizeNormalHeight,
        ...styles.justifyContentCenter,
    }),
    getTaskPreviewTitleStyle: (iconHeight, isTaskCompleted) => [
        styles.flex1,
        isTaskCompleted ? [styles.textSupporting, styles.textLineThrough] : [],
        { marginTop: (iconHeight - variables_1.default.fontSizeNormalHeight) / 2 },
    ],
    getResetStyle: (keys) => keys.reduce((styleObj, key) => {
        // eslint-disable-next-line no-param-reassign
        styleObj[key] = null;
        return styleObj;
    }, {}),
    getScrollableFeatureTrainingModalStyles: (insets, isKeyboardOpen = false) => {
        const { paddingBottom: safeAreaPaddingBottom } = getPlatformSafeAreaPadding(insets);
        // When keyboard is open and we want to disregard safeAreaPaddingBottom.
        const paddingBottom = getCombinedSpacing(styles.pb5.paddingBottom, safeAreaPaddingBottom, !isKeyboardOpen);
        // Forces scroll on modal when keyboard is open and the modal larger than remaining screen height.
        return {
            style: (0, Browser_1.isMobileChrome)()
                ? {
                    maxHeight: '100dvh',
                }
                : {},
            containerStyle: { paddingBottom },
        };
    },
});
const DefaultStyleUtils = createStyleUtils(theme_1.defaultTheme, __1.defaultStyles);
exports.DefaultStyleUtils = DefaultStyleUtils;
exports.default = createStyleUtils;
