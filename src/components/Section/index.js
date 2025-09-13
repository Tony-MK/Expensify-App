"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CARD_LAYOUT = void 0;
const react_1 = require("react");
const react_native_1 = require("react-native");
const ImageSVG_1 = require("@components/ImageSVG");
const Lottie_1 = require("@components/Lottie");
const MenuItemList_1 = require("@components/MenuItemList");
const Text_1 = require("@components/Text");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const isIllustrationLottieAnimation_1 = require("@libs/isIllustrationLottieAnimation");
const IconSection_1 = require("./IconSection");
const CARD_LAYOUT = {
    ICON_ON_TOP: 'iconOnTop',
    ICON_ON_LEFT: 'iconOnLeft',
    ICON_ON_RIGHT: 'iconOnRight',
};
exports.CARD_LAYOUT = CARD_LAYOUT;
function Section({ children, childrenStyles, containerStyles, icon, cardLayout = CARD_LAYOUT.ICON_ON_RIGHT, iconContainerStyles, menuItems, subtitle, subtitleStyles, subtitleTextStyles, subtitleMuted = false, title, renderTitle, titleStyles, isCentralPane = false, illustration, illustrationBackgroundColor, illustrationContainerStyle, illustrationStyle, contentPaddingOnLargeScreens, overlayContent, iconWidth, iconHeight, renderSubtitle, banner = null, }) {
    const styles = (0, useThemeStyles_1.default)();
    const theme = (0, useTheme_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const isLottie = (0, isIllustrationLottieAnimation_1.default)(illustration);
    const lottieIllustration = isLottie ? illustration : undefined;
    return (<react_native_1.View style={[styles.pageWrapper, styles.cardSectionContainer, containerStyles, (isCentralPane || !!illustration) && styles.p0]}>
            {banner}
            {cardLayout === CARD_LAYOUT.ICON_ON_TOP && (<IconSection_1.default width={iconWidth} height={iconHeight} icon={icon} iconContainerStyles={[iconContainerStyles, styles.alignSelfStart, styles.mb3]}/>)}
            {!!illustration && (<react_native_1.View style={[
                styles.w100,
                styles.dFlex,
                styles.alignItemsCenter,
                styles.justifyContentCenter,
                StyleUtils.getBackgroundColorStyle(illustrationBackgroundColor ?? lottieIllustration?.backgroundColor ?? theme.appBG),
                illustrationContainerStyle,
            ]}>
                    <react_native_1.View style={[styles.cardSectionIllustration, illustrationStyle]}>
                        {isLottie ? (<Lottie_1.default source={illustration} style={styles.h100} webStyle={styles.h100} autoPlay loop shouldLoadAfterInteractions={shouldUseNarrowLayout}/>) : (<ImageSVG_1.default src={illustration} contentFit="contain"/>)}
                    </react_native_1.View>
                    {overlayContent?.()}
                </react_native_1.View>)}
            <react_native_1.View style={[styles.w100, isCentralPane && (shouldUseNarrowLayout ? styles.p5 : (contentPaddingOnLargeScreens ?? styles.p8))]}>
                <react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.w100, cardLayout === CARD_LAYOUT.ICON_ON_TOP && styles.mh1]}>
                    {cardLayout === CARD_LAYOUT.ICON_ON_LEFT && (<IconSection_1.default width={iconWidth} height={iconHeight} icon={icon} iconContainerStyles={[styles.flexGrow0, styles.justifyContentStart, iconContainerStyles]}/>)}
                    <react_native_1.View style={[styles.flexShrink1, styles.w100]}>
                        {renderTitle ? renderTitle() : <Text_1.default style={[styles.textHeadline, styles.cardSectionTitle, titleStyles]}>{title}</Text_1.default>}
                    </react_native_1.View>
                    {cardLayout === CARD_LAYOUT.ICON_ON_RIGHT && (<IconSection_1.default width={iconWidth} height={iconHeight} icon={icon} iconContainerStyles={iconContainerStyles}/>)}
                </react_native_1.View>

                {renderSubtitle
            ? renderSubtitle?.()
            : !!subtitle && (<react_native_1.View style={[styles.flexRow, styles.alignItemsCenter, styles.w100, cardLayout === CARD_LAYOUT.ICON_ON_TOP ? [styles.mt1, styles.mh1] : styles.mt2, subtitleStyles]}>
                              <Text_1.default style={[styles.textNormal, subtitleMuted && styles.colorMuted, subtitleTextStyles]}>{subtitle}</Text_1.default>
                          </react_native_1.View>)}

                <react_native_1.View style={[styles.w100, childrenStyles]}>{children}</react_native_1.View>

                <react_native_1.View style={[styles.w100]}>{!!menuItems && <MenuItemList_1.default menuItems={menuItems}/>}</react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
}
Section.displayName = 'Section';
exports.default = Section;
