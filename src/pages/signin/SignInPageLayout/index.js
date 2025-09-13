"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const home_fade_gradient_svg_1 = require("@assets/images/home-fade-gradient.svg");
const ImageSVG_1 = require("@components/ImageSVG");
const ScrollView_1 = require("@components/ScrollView");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSafeAreaInsets_1 = require("@hooks/useSafeAreaInsets");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Browser_1 = require("@libs/Browser");
const DomUtils_1 = require("@libs/DomUtils");
const getPlatform_1 = require("@libs/getPlatform");
// eslint-disable-next-line no-restricted-imports
const theme_1 = require("@styles/theme");
const variables_1 = require("@styles/variables");
const CONST_1 = require("@src/CONST");
const BackgroundImage_1 = require("./BackgroundImage");
const Footer_1 = require("./Footer");
const SignInPageContent_1 = require("./SignInPageContent");
const SignInPageHero_1 = require("./SignInPageHero");
const signInPageStyles_1 = require("./signInPageStyles");
function SignInPageLayout({ customHeadline, customHeroBody, shouldShowWelcomeHeader = false, welcomeHeader, welcomeText = '', shouldShowWelcomeText = false, navigateFocus = () => { }, children, ref, }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { top: topInsets, bottom: bottomInsets } = (0, useSafeAreaInsets_1.default)();
    const scrollViewRef = (0, react_1.useRef)(null);
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout, isMediumScreenWidth, isLargeScreenWidth } = (0, useResponsiveLayout_1.default)();
    const { containerStyles, contentContainerStyles } = (0, react_1.useMemo)(() => ({
        containerStyles: shouldUseNarrowLayout ? [styles.flex1] : [styles.flex1, styles.signInPageInner],
        contentContainerStyles: [styles.flex1, shouldUseNarrowLayout ? styles.flexColumn : styles.flexRow],
    }), [shouldUseNarrowLayout, styles]);
    // To scroll on both mobile and web, we need to set the container height manually
    const containerHeight = windowHeight - topInsets - bottomInsets;
    const scrollPageToTop = (animated = false) => {
        if (!scrollViewRef.current) {
            return;
        }
        scrollViewRef.current.scrollTo({ y: 0, animated });
    };
    (0, react_1.useImperativeHandle)(ref, () => ({
        scrollPageToTop,
    }));
    const scrollViewStyles = (0, react_1.useMemo)(() => (0, signInPageStyles_1.default)(styles), [styles]);
    const backgroundImageHeight = Math.max(variables_1.default.signInContentMinHeight, containerHeight);
    /*
    SignInPageLayout always has a dark theme regardless of the app theme. ThemeProvider sets auto-fill input styles globally so different ThemeProviders conflict and auto-fill input styles are incorrectly applied for this component.
    Add a class to `body` when this component stays mounted and remove it when the component dismounts.
    A new styleID is added with dark theme text with more specific css selector using this added cssClass.
    */
    const cssClass = 'sign-in-page-layout';
    DomUtils_1.default.addCSS(DomUtils_1.default.getAutofilledInputStyle(theme_1.default[CONST_1.default.THEME.DARK].text, `.${cssClass}`), 'sign-in-autofill-input');
    (0, react_1.useEffect)(() => {
        const isWeb = (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.WEB;
        const isDesktop = (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.DESKTOP;
        if (!isWeb && !isDesktop) {
            return;
        }
        // add css class to body only for web and desktop
        document.body.classList.add(cssClass);
        return () => {
            document.body.classList.remove(cssClass);
        };
    }, []);
    return (<react_native_1.View style={containerStyles}>
            {!shouldUseNarrowLayout ? (<react_native_1.View style={contentContainerStyles}>
                    <ScrollView_1.default keyboardShouldPersistTaps="handled" style={[styles.signInPageLeftContainerWide, styles.flex1]} contentContainerStyle={[styles.flex1]}>
                        <SignInPageContent_1.default welcomeHeader={welcomeHeader} welcomeText={welcomeText} shouldShowWelcomeText={shouldShowWelcomeText} shouldShowWelcomeHeader={shouldShowWelcomeHeader}>
                            {children}
                        </SignInPageContent_1.default>
                    </ScrollView_1.default>
                    <ScrollView_1.default style={[styles.flex1, StyleUtils.getBackgroundColorStyle(theme.signInPage)]} contentContainerStyle={[styles.flex1]} ref={scrollViewRef}>
                        <react_native_1.View style={[styles.flex1]}>
                            <react_native_1.View style={styles.signInPageHeroCenter}>
                                <BackgroundImage_1.default isSmallScreen={false} pointerEvents="none" width={variables_1.default.signInHeroBackgroundWidth} transitionDuration={CONST_1.default.BACKGROUND_IMAGE_TRANSITION_DURATION}/>
                            </react_native_1.View>
                            <react_native_1.View>
                                <react_native_1.View style={[styles.t0, styles.l0, styles.h100, styles.pAbsolute, styles.signInPageGradient]}>
                                    <ImageSVG_1.default src={home_fade_gradient_svg_1.default} height="100%" preserveAspectRatio="none"/>
                                </react_native_1.View>
                                <react_native_1.View style={[
                styles.alignSelfCenter,
                StyleUtils.getMaximumWidth(variables_1.default.signInContentMaxWidth),
                isMediumScreenWidth ? styles.ph10 : {},
                isLargeScreenWidth ? styles.ph25 : {},
            ]}>
                                    <SignInPageHero_1.default customHeadline={customHeadline} customHeroBody={customHeroBody}/>
                                    <Footer_1.default navigateFocus={navigateFocus}/>
                                </react_native_1.View>
                            </react_native_1.View>
                        </react_native_1.View>
                    </ScrollView_1.default>
                </react_native_1.View>) : (<ScrollView_1.default contentContainerStyle={scrollViewStyles} keyboardShouldPersistTaps="handled" ref={scrollViewRef}>
                    <react_native_1.View style={[
                styles.flex1,
                styles.flexColumn,
                (0, Browser_1.isMobileSafari)() ? styles.overflowHidden : {},
                StyleUtils.getMinimumHeight(backgroundImageHeight),
                StyleUtils.getSignInBgStyles(theme),
            ]}>
                        <react_native_1.View style={[styles.pAbsolute, styles.w100, StyleUtils.getHeight(backgroundImageHeight), StyleUtils.getBackgroundColorStyle(theme.highlightBG)]}>
                            <BackgroundImage_1.default isSmallScreen pointerEvents="none" width={variables_1.default.signInHeroBackgroundWidthMobile} transitionDuration={CONST_1.default.BACKGROUND_IMAGE_TRANSITION_DURATION}/>
                        </react_native_1.View>
                        <SignInPageContent_1.default welcomeHeader={welcomeHeader} welcomeText={welcomeText} shouldShowWelcomeText={shouldShowWelcomeText} shouldShowWelcomeHeader={shouldShowWelcomeHeader}>
                            {children}
                        </SignInPageContent_1.default>
                    </react_native_1.View>
                    <react_native_1.View style={[styles.flex0]}>
                        <Footer_1.default navigateFocus={navigateFocus}/>
                    </react_native_1.View>
                </ScrollView_1.default>)}
        </react_native_1.View>);
}
SignInPageLayout.displayName = 'SignInPageLayout';
exports.default = SignInPageLayout;
