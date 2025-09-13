"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const FullScreenBlockingViewContextProvider_1 = require("@components/FullScreenBlockingViewContextProvider");
const NavigationTabBar_1 = require("@components/Navigation/NavigationTabBar");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useSafeAreaPaddings_1 = require("@hooks/useSafeAreaPaddings");
const useStyleUtils_1 = require("@hooks/useStyleUtils");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const getIsNavigationTabBarVisibleDirectly_1 = require("./getIsNavigationTabBarVisibleDirectly");
const getIsScreenWithNavigationTabBarFocused_1 = require("./getIsScreenWithNavigationTabBarFocused");
const getSelectedTab_1 = require("./getSelectedTab");
/**
 * TopLevelNavigationTabBar is displayed when the user can interact with the bottom tab bar.
 * We hide it when:
 * 1. The bottom tab bar is not visible.
 * 2. There is transition between screens with and without the bottom tab bar.
 * 3. The bottom tab bar is under the overlay.
 * For cases 2 and 3, local bottom tab bar mounted on the screen will be displayed.
 */
function TopLevelNavigationTabBar({ state }) {
    const styles = (0, useThemeStyles_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const { paddingBottom } = (0, useSafeAreaPaddings_1.default)();
    const [isAfterClosingTransition, setIsAfterClosingTransition] = (0, react_1.useState)(false);
    const cancelAfterInteractions = (0, react_1.useRef)(undefined);
    const { isBlockingViewVisible } = (0, react_1.useContext)(FullScreenBlockingViewContextProvider_1.FullScreenBlockingViewContext);
    const StyleUtils = (0, useStyleUtils_1.default)();
    // That means it's visible and it's not covered by the overlay.
    const isNavigationTabVisibleDirectly = (0, getIsNavigationTabBarVisibleDirectly_1.default)(state);
    const isScreenWithNavigationTabFocused = (0, getIsScreenWithNavigationTabBarFocused_1.default)(state);
    const selectedTab = (0, getSelectedTab_1.default)(state);
    const shouldDisplayBottomBar = shouldUseNarrowLayout ? isScreenWithNavigationTabFocused : isNavigationTabVisibleDirectly;
    const isReadyToDisplayBottomBar = isAfterClosingTransition && shouldDisplayBottomBar && !isBlockingViewVisible;
    const shouldDisplayLHB = !shouldUseNarrowLayout;
    (0, react_1.useEffect)(() => {
        if (!shouldDisplayBottomBar) {
            // If the bottom tab is not visible, that means there is a screen covering it.
            // In that case we need to set the flag to true because there will be a transition for which we need to wait.
            setIsAfterClosingTransition(false);
        }
        else {
            // If the bottom tab should be visible, we want to wait for transition to finish.
            cancelAfterInteractions.current = react_native_1.InteractionManager.runAfterInteractions(() => {
                setIsAfterClosingTransition(true);
            });
            return () => cancelAfterInteractions.current?.cancel();
        }
    }, [shouldDisplayBottomBar]);
    return (<react_native_1.View style={[
            styles.topLevelNavigationTabBar(isReadyToDisplayBottomBar, shouldUseNarrowLayout, paddingBottom),
            shouldDisplayLHB ? StyleUtils.positioning.l0 : StyleUtils.positioning.b0,
        ]}>
            {/* We are not rendering NavigationTabBar conditionally for two reasons
            1. It's faster to hide/show it than mount a new when needed.
            2. We need to hide tooltips as well if they were displayed. */}
            <NavigationTabBar_1.default selectedTab={selectedTab} isTooltipAllowed={isReadyToDisplayBottomBar} isTopLevelBar/>
        </react_native_1.View>);
}
TopLevelNavigationTabBar.displayName = 'TopLevelNavigationTabBar';
exports.default = TopLevelNavigationTabBar;
