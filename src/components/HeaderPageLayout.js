"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useNetwork_1 = require("@hooks/useNetwork");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const useWindowDimensions_1 = require("@hooks/useWindowDimensions");
const Browser = require("@libs/Browser");
const FixedFooter_1 = require("./FixedFooter");
const HeaderWithBackButton_1 = require("./HeaderWithBackButton");
const ScreenWrapper_1 = require("./ScreenWrapper");
const ScrollView_1 = require("./ScrollView");
function HeaderPageLayout({ backgroundColor, children, footer, headerContainerStyles, scrollViewContainerStyles, childrenContainerStyles, style, headerContent, shouldShowOfflineIndicatorInWideScreen = false, testID, keyboardShouldPersistTaps, ...rest }) {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { windowHeight } = (0, useWindowDimensions_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const appBGColor = StyleUtils.getBackgroundColorStyle(theme.appBG);
    const { titleColor, iconFill } = (0, react_1.useMemo)(() => {
        const isColorfulBackground = (backgroundColor ?? theme.appBG) !== theme.appBG && (backgroundColor ?? theme.highlightBG) !== theme.highlightBG;
        return {
            titleColor: isColorfulBackground ? theme.textColorfulBackground : undefined,
            iconFill: isColorfulBackground ? theme.iconColorfulBackground : undefined,
        };
    }, [backgroundColor, theme.appBG, theme.highlightBG, theme.iconColorfulBackground, theme.textColorfulBackground]);
    return (<ScreenWrapper_1.default style={[StyleUtils.getBackgroundColorStyle(backgroundColor ?? theme.appBG)]} shouldEnablePickerAvoiding={false} includeSafeAreaPaddingBottom={false} offlineIndicatorStyle={[appBGColor]} testID={testID} shouldShowOfflineIndicatorInWideScreen={shouldShowOfflineIndicatorInWideScreen}>
            {({ safeAreaPaddingBottomStyle }) => (<>
                    <HeaderWithBackButton_1.default 
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest} titleColor={titleColor} iconFill={iconFill}/>
                    <react_native_1.View style={[styles.flex1, appBGColor, !isOffline && footer ? safeAreaPaddingBottomStyle : {}]}>
                        {/** Safari on ios/mac has a bug where over scrolling the page ScrollView shows green background color. This is a workaround to fix that. https://github.com/Expensify/App/issues/23422 */}
                        {Browser.isSafari() && (<react_native_1.View style={styles.dualColorOverscrollSpacer}>
                                <react_native_1.View style={[styles.flex1, StyleUtils.getBackgroundColorStyle(backgroundColor ?? theme.appBG)]}/>
                                <react_native_1.View style={[shouldUseNarrowLayout ? styles.flex1 : styles.flex3, appBGColor]}/>
                            </react_native_1.View>)}
                        <ScrollView_1.default contentContainerStyle={[safeAreaPaddingBottomStyle, style, scrollViewContainerStyles]} keyboardShouldPersistTaps={keyboardShouldPersistTaps}>
                            {!Browser.isSafari() && <react_native_1.View style={styles.overscrollSpacer(backgroundColor ?? theme.appBG, windowHeight)}/>}
                            <react_native_1.View style={[styles.alignItemsCenter, styles.justifyContentEnd, StyleUtils.getBackgroundColorStyle(backgroundColor ?? theme.appBG), headerContainerStyles]}>
                                {headerContent}
                            </react_native_1.View>
                            <react_native_1.View style={[styles.pt5, appBGColor, childrenContainerStyles]}>{children}</react_native_1.View>
                        </ScrollView_1.default>
                        {!!footer && <FixedFooter_1.default>{footer}</FixedFooter_1.default>}
                    </react_native_1.View>
                </>)}
        </ScreenWrapper_1.default>);
}
HeaderPageLayout.displayName = 'HeaderPageLayout';
exports.default = HeaderPageLayout;
