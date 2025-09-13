"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_reanimated_1 = require("react-native-reanimated");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useTheme_1 = require("@hooks/useTheme");
const Navigation_1 = require("@libs/Navigation/Navigation");
const StatusBar_1 = require("@libs/StatusBar");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const CustomStatusBarAndBackgroundContext_1 = require("./CustomStatusBarAndBackgroundContext");
const updateGlobalBackgroundColor_1 = require("./updateGlobalBackgroundColor");
const updateStatusBarAppearance_1 = require("./updateStatusBarAppearance");
function CustomStatusBarAndBackground({ isNested = false }) {
    const { isRootStatusBarEnabled, setRootStatusBarEnabled } = (0, react_1.useContext)(CustomStatusBarAndBackgroundContext_1.default);
    const theme = (0, useTheme_1.default)();
    const [statusBarStyle, setStatusBarStyle] = (0, react_1.useState)();
    const [closingReactNativeApp = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.HYBRID_APP, { selector: (hybridApp) => hybridApp?.closingReactNativeApp, canBeMissing: true });
    // Include `closingReactNativeApp` to disable the StatusBar when switching from HybridApp to OldDot,
    // preventing unexpected status bar blinking during the transition
    const isDisabled = (!isNested && !isRootStatusBarEnabled) || closingReactNativeApp;
    // Disable the root status bar when a nested status bar is rendered
    (0, react_1.useEffect)(() => {
        if (isNested) {
            setRootStatusBarEnabled(false);
        }
        return () => {
            if (!isNested) {
                return;
            }
            setRootStatusBarEnabled(true);
        };
    }, [isNested, setRootStatusBarEnabled]);
    const didForceUpdateStatusBarRef = (0, react_1.useRef)(false);
    const prevIsRootStatusBarEnabled = (0, usePrevious_1.default)(isRootStatusBarEnabled);
    // The prev and current status bar background color refs are initialized with the splash screen background color so the status bar color is changed from the splash screen color to the expected color at least once on first render - https://github.com/Expensify/App/issues/34154
    const prevStatusBarBackgroundColor = (0, react_native_reanimated_1.useSharedValue)(theme.splashBG);
    const statusBarBackgroundColor = (0, react_native_reanimated_1.useSharedValue)(theme.splashBG);
    const statusBarAnimation = (0, react_native_reanimated_1.useSharedValue)(0);
    (0, react_native_reanimated_1.useAnimatedReaction)(() => statusBarAnimation.get(), (current, previous) => {
        // Do not run if either of the animated value is null
        // or previous animated value is greater than or equal to the current one
        if (previous === null || current === null || current <= previous) {
            return;
        }
        const backgroundColor = (0, react_native_reanimated_1.interpolateColor)(statusBarAnimation.get(), [0, 1], [prevStatusBarBackgroundColor.get(), statusBarBackgroundColor.get()]);
        (0, react_native_reanimated_1.runOnJS)(updateStatusBarAppearance_1.default)({ backgroundColor });
    });
    const listenerCount = (0, react_1.useRef)(0);
    // Updates the status bar style and background color depending on the current route and theme
    // This callback is triggered every time the route changes or the theme changes
    const updateStatusBarStyle = (0, react_1.useCallback)((listenerID) => {
        // Check if this function is either called through the current navigation listener
        // react-navigation library has a bug internally, where it can't keep track of the listeners, therefore, sometimes when the useEffect would re-render and we run navigationRef.removeListener the listener isn't removed and we end up with two or more listeners.
        // https://github.com/Expensify/App/issues/34154#issuecomment-1898519399
        if (listenerID !== undefined && listenerID !== listenerCount.current) {
            return;
        }
        // Set the status bar color depending on the current route.
        // If we don't have any color defined for a route, fall back to
        // appBG color.
        let currentRoute;
        if (Navigation_1.navigationRef.isReady()) {
            currentRoute = Navigation_1.navigationRef.getCurrentRoute();
        }
        let newStatusBarStyle = theme.statusBarStyle;
        let currentScreenBackgroundColor = theme.appBG;
        if (currentRoute && 'name' in currentRoute && currentRoute.name in theme.PAGE_THEMES) {
            const pageTheme = theme.PAGE_THEMES[currentRoute.name];
            newStatusBarStyle = pageTheme.statusBarStyle;
            const backgroundColorFromRoute = currentRoute?.params &&
                typeof currentRoute?.params === 'object' &&
                'backgroundColor' in currentRoute.params &&
                typeof currentRoute.params.backgroundColor === 'string' &&
                currentRoute.params.backgroundColor;
            // It's possible for backgroundColorFromRoute to be empty string, so we must use "||" to fallback to backgroundColorFallback.
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            currentScreenBackgroundColor = backgroundColorFromRoute || pageTheme.backgroundColor;
        }
        prevStatusBarBackgroundColor.set(statusBarBackgroundColor.get());
        statusBarBackgroundColor.set(currentScreenBackgroundColor);
        const callUpdateStatusBarAppearance = () => {
            (0, updateStatusBarAppearance_1.default)({ statusBarStyle: newStatusBarStyle });
            setStatusBarStyle(newStatusBarStyle);
        };
        const callUpdateStatusBarBackgroundColor = () => {
            statusBarAnimation.set(0);
            statusBarAnimation.set((0, react_native_reanimated_1.withDelay)(300, (0, react_native_reanimated_1.withTiming)(1)));
        };
        // Don't update the status bar style if it's the same as the current one, to prevent flashing.
        // Force update if the root status bar is back on active or it won't overwrite the nested status bar style
        if (!didForceUpdateStatusBarRef.current && !prevIsRootStatusBarEnabled && isRootStatusBarEnabled) {
            callUpdateStatusBarAppearance();
            callUpdateStatusBarBackgroundColor();
            if (!prevIsRootStatusBarEnabled && isRootStatusBarEnabled) {
                didForceUpdateStatusBarRef.current = true;
            }
            return;
        }
        if (newStatusBarStyle !== statusBarStyle) {
            callUpdateStatusBarAppearance();
        }
        if (currentScreenBackgroundColor !== theme.appBG || prevStatusBarBackgroundColor.get() !== theme.appBG) {
            callUpdateStatusBarBackgroundColor();
        }
    }, [
        theme.statusBarStyle,
        theme.appBG,
        theme.PAGE_THEMES,
        prevStatusBarBackgroundColor,
        statusBarBackgroundColor,
        prevIsRootStatusBarEnabled,
        isRootStatusBarEnabled,
        statusBarStyle,
        statusBarAnimation,
    ]);
    (0, react_1.useEffect)(() => {
        didForceUpdateStatusBarRef.current = false;
    }, [isRootStatusBarEnabled]);
    (0, react_1.useEffect)(() => {
        if (isDisabled) {
            return;
        }
        // Update status bar when theme changes
        updateStatusBarStyle();
        // Add navigation state listeners to update the status bar every time the route changes
        // We have to pass a count as the listener id, because "react-navigation" somehow doesn't remove listeners properly
        const listenerID = ++listenerCount.current;
        const listener = () => updateStatusBarStyle(listenerID);
        Navigation_1.navigationRef.addListener('state', listener);
        return () => Navigation_1.navigationRef.removeListener('state', listener);
    }, [isDisabled, updateStatusBarStyle]);
    // Update the global background and status bar style (on web) every time the theme changes.
    // The background of the html element needs to be updated, otherwise you will see a big contrast when resizing the window or when the keyboard is open on iOS web.
    // The status bar style needs to be updated when the user changes the theme, otherwise, the status bar will not change its color (mWeb iOS).
    (0, react_1.useEffect)(() => {
        if (isDisabled) {
            return;
        }
        (0, updateGlobalBackgroundColor_1.default)(theme);
        updateStatusBarStyle();
    }, [isDisabled, theme, updateStatusBarStyle]);
    if (isDisabled) {
        return null;
    }
    return <StatusBar_1.default />;
}
CustomStatusBarAndBackground.displayName = 'CustomStatusBarAndBackground';
exports.default = CustomStatusBarAndBackground;
