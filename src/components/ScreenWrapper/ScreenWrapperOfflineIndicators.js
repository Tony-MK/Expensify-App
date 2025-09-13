"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const ImportedStateIndicator_1 = require("@components/ImportedStateIndicator");
const OfflineIndicator_1 = require("@components/OfflineIndicator");
const useBottomSafeSafeAreaPaddingStyle_1 = require("@hooks/useBottomSafeSafeAreaPaddingStyle");
const useNetwork_1 = require("@hooks/useNetwork");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
function ScreenWrapperOfflineIndicators({ offlineIndicatorStyle, shouldShowOfflineIndicator: shouldShowSmallScreenOfflineIndicator = true, shouldShowOfflineIndicatorInWideScreen: shouldShowWideScreenOfflineIndicator = false, shouldMobileOfflineIndicatorStickToBottom: shouldSmallScreenOfflineIndicatorStickToBottom = true, isOfflineIndicatorTranslucent = false, extraContent, addBottomSafeAreaPadding = true, addWideScreenBottomSafeAreaPadding = !!extraContent, }) {
    const styles = (0, useThemeStyles_1.default)();
    const StyleUtils = (0, useStyleUtils_1.default)();
    const { isOffline } = (0, useNetwork_1.default)();
    const { insets } = (0, useSafeAreaPaddings_1.default)(true);
    const navigationBarType = (0, react_1.useMemo)(() => StyleUtils.getNavigationBarType(insets), [StyleUtils, insets]);
    const isSoftKeyNavigation = navigationBarType === CONST_1.default.NAVIGATION_BAR_TYPE.SOFT_KEYS;
    /**
     * This style applies the background color of the small screen offline indicator.
     * When there is not bottom content, and the device either has soft keys or is offline,
     * the background style is applied.
     * By default, the background color of the small screen offline indicator is translucent.
     * If `isOfflineIndicatorTranslucent` is set to true, an opaque background color is applied.
     */
    const smallScreenOfflineIndicatorBackgroundStyle = (0, react_1.useMemo)(() => {
        const showOfflineIndicatorBackground = !extraContent && (isSoftKeyNavigation || isOffline);
        if (!showOfflineIndicatorBackground) {
            return undefined;
        }
        return isOfflineIndicatorTranslucent ? styles.translucentNavigationBarBG : styles.appBG;
    }, [extraContent, isOffline, isOfflineIndicatorTranslucent, isSoftKeyNavigation, styles.appBG, styles.translucentNavigationBarBG]);
    /**
     * This style includes the bottom safe area padding for the small screen offline indicator.
     * If the device has soft keys, the small screen offline indicator will stick to the navigation bar (bottom of the screen)
     * The small screen offline indicator container will have a translucent background. Therefore, we want to offset it
     * by the bottom safe area padding rather than adding padding to the container, so that there are not
     * two overlapping layers of translucent background.
     * If the device does not have soft keys, the bottom safe area padding is applied as `paddingBottom`.
     */
    const smallScreenOfflineIndicatorBottomSafeAreaStyle = (0, useBottomSafeSafeAreaPaddingStyle_1.default)({
        addBottomSafeAreaPadding,
        addOfflineIndicatorBottomSafeAreaPadding: false,
        styleProperty: isSoftKeyNavigation ? 'bottom' : 'paddingBottom',
    });
    /**
     * This style includes all styles applied to the container of the small screen offline indicator.
     * It always applies the bottom safe area padding as well as the background style, if the device has soft keys.
     * In this case, we want the whole container (including the bottom safe area padding) to have translucent/opaque background.
     */
    const smallScreenOfflineIndicatorContainerStyle = (0, react_1.useMemo)(() => [
        smallScreenOfflineIndicatorBottomSafeAreaStyle,
        shouldSmallScreenOfflineIndicatorStickToBottom && styles.stickToBottom,
        !isSoftKeyNavigation && smallScreenOfflineIndicatorBackgroundStyle,
    ], [
        smallScreenOfflineIndicatorBottomSafeAreaStyle,
        shouldSmallScreenOfflineIndicatorStickToBottom,
        styles.stickToBottom,
        isSoftKeyNavigation,
        smallScreenOfflineIndicatorBackgroundStyle,
    ]);
    /**
     * This style includes the styles applied to the small screen offline indicator component.
     * If the device has soft keys, we only want to apply the background style to the small screen offline indicator component,
     * rather than the whole container, because otherwise the navigation bar would be extra opaque, since it already has a translucent background.
     */
    const smallScreenOfflineIndicatorStyle = (0, react_1.useMemo)(() => [styles.pl5, isSoftKeyNavigation && smallScreenOfflineIndicatorBackgroundStyle, offlineIndicatorStyle], [isSoftKeyNavigation, smallScreenOfflineIndicatorBackgroundStyle, offlineIndicatorStyle, styles.pl5]);
    return (<>
            {shouldShowSmallScreenOfflineIndicator && (<>
                    {isOffline && (<react_native_1.View style={[smallScreenOfflineIndicatorContainerStyle]}>
                            <OfflineIndicator_1.default style={smallScreenOfflineIndicatorStyle}/>
                            {/* Since import state is tightly coupled to the offline state, it is safe to display it when showing offline indicator */}
                        </react_native_1.View>)}
                    <ImportedStateIndicator_1.default />
                </>)}
            {shouldShowWideScreenOfflineIndicator && (<>
                    <OfflineIndicator_1.default style={[styles.pl5, offlineIndicatorStyle]} addBottomSafeAreaPadding={addWideScreenBottomSafeAreaPadding}/>
                    {/* Since import state is tightly coupled to the offline state, it is safe to display it when showing offline indicator */}
                    <ImportedStateIndicator_1.default />
                </>)}
        </>);
}
ScreenWrapperOfflineIndicators.displayName = 'ScreenWrapperOfflineIndicators';
exports.default = ScreenWrapperOfflineIndicators;
