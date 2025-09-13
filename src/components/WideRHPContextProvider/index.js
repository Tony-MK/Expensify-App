"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WideRHPContext = exports.secondOverlayProgress = exports.receiptPaneRHPWidth = exports.expandedRHPProgress = void 0;
exports.useShowWideRHPVersion = useShowWideRHPVersion;
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
// We use Animated for all functionality related to wide RHP to make it easier
// to interact with react-navigation components (e.g., CardContainer, interpolator), which also use Animated.
// eslint-disable-next-line no-restricted-imports
const react_native_1 = require("react-native");
const useRootNavigationState_1 = require("@hooks/useRootNavigationState");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
const variables_1 = require("@styles/variables");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
const default_1 = require("./default");
// 0 is folded/hidden, 1 is expanded/shown
const expandedRHPProgress = new react_native_1.Animated.Value(0);
exports.expandedRHPProgress = expandedRHPProgress;
const secondOverlayProgress = new react_native_1.Animated.Value(0);
exports.secondOverlayProgress = secondOverlayProgress;
const wideRHPMaxWidth = variables_1.default.receiptPaneRHPMaxWidth + variables_1.default.sideBarWidth;
/**
 * Calculates the optimal width for the receipt pane RHP based on window width.
 * Ensures the RHP doesn't exceed maximum width and maintains minimum responsive width.
 *
 * @param windowWidth - Current window width in pixels
 * @returns Calculated RHP width with constraints applied
 */
const calculateReceiptPaneRHPWidth = (windowWidth) => {
    const calculatedWidth = windowWidth < wideRHPMaxWidth ? variables_1.default.receiptPaneRHPMaxWidth - (wideRHPMaxWidth - windowWidth) : variables_1.default.receiptPaneRHPMaxWidth;
    return Math.max(calculatedWidth, variables_1.default.mobileResponsiveWidthBreakpoint - variables_1.default.sideBarWidth);
};
// This animated value is necessary to have a responsive RHP width for the range 800px to 840px.
const receiptPaneRHPWidth = new react_native_1.Animated.Value(calculateReceiptPaneRHPWidth(react_native_1.Dimensions.get('window').width));
exports.receiptPaneRHPWidth = receiptPaneRHPWidth;
const WideRHPContext = (0, react_1.createContext)(default_1.default);
exports.WideRHPContext = WideRHPContext;
function WideRHPContextProvider({ children }) {
    const [wideRHPRouteKeys, setWideRHPRouteKeys] = (0, react_1.useState)([]);
    const [shouldRenderSecondaryOverlay, setShouldRenderSecondaryOverlay] = (0, react_1.useState)(false);
    const [expenseReportIDs, setExpenseReportIDs] = (0, react_1.useState)(new Set());
    /**
     * Determines whether the secondary overlay should be displayed.
     * Shows second overlay when RHP is open and there is a wide RHP route open but there is another regular route on the top.
     */
    const shouldShowSecondaryOverlay = (0, useRootNavigationState_1.default)((state) => {
        const focusedRoute = (0, native_1.findFocusedRoute)(state);
        const isRHPLastRootRoute = state?.routes.at(-1)?.name === NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR;
        // Shouldn't ever happen but for type safety
        if (!focusedRoute?.key) {
            return false;
        }
        // Check the focused route to avoid glitching when quickly close and open RHP.
        if (wideRHPRouteKeys.length > 0 && !wideRHPRouteKeys.includes(focusedRoute.key) && isRHPLastRootRoute && focusedRoute.name !== SCREENS_1.default.SEARCH.REPORT_RHP) {
            return true;
        }
        return false;
    });
    /**
     * Adds a route to the wide RHP route keys list, enabling wide RHP display for that route.
     */
    const showWideRHPVersion = (0, react_1.useCallback)((route) => {
        if (!route.key) {
            console.error(`The route passed to showWideRHPVersion should have the "key" property defined.`);
            return;
        }
        const newKey = route.key;
        // If the key is in the array, don't add it.
        setWideRHPRouteKeys((prev) => (prev.includes(newKey) ? prev : [newKey, ...prev]));
    }, []);
    /**
     * Removes a route from the wide RHP route keys list, disabling wide RHP display for that route.
     */
    const cleanWideRHPRouteKey = (0, react_1.useCallback)((route) => {
        if (!route.key) {
            console.error(`The route passed to cleanWideRHPRouteKey should have the "key" property defined.`);
            return;
        }
        const keyToRemove = route.key;
        // Do nothing, the key is not here
        if (!wideRHPRouteKeys.includes(keyToRemove)) {
            return;
        }
        setWideRHPRouteKeys((prev) => prev.filter((key) => key !== keyToRemove));
    }, [wideRHPRouteKeys]);
    /**
     * Dismiss top layer modal and go back to the wide RHP.
     */
    const dismissToWideReport = (0, react_1.useCallback)(() => {
        const rootState = navigationRef_1.default.getRootState();
        if (!rootState) {
            return;
        }
        const rhpStateKey = rootState.routes.findLast((route) => route.name === NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR)?.state?.key;
        if (!rhpStateKey) {
            return;
        }
        // In the current navigation structure, hardcoding popTo SCREENS.RIGHT_MODAL.SEARCH_REPORT works exactly as we want.
        // It may change in the future and we may need to improve this function to handle more complex configurations.
        navigationRef_1.default.dispatch({ ...native_1.StackActions.popTo(SCREENS_1.default.RIGHT_MODAL.SEARCH_REPORT), target: rhpStateKey });
    }, []);
    /**
     * Marks a report ID as an expense report, adding it to the expense reports set.
     * This enables optimistic wide RHP display for expense reports.
     * It helps us open expense as wide, before it fully loads.
     */
    const markReportIDAsExpense = (0, react_1.useCallback)((reportID) => {
        setExpenseReportIDs((prev) => {
            const newSet = new Set(prev);
            newSet.add(reportID);
            return newSet;
        });
    }, []);
    /**
     * Checks if a report ID is marked as an expense report.
     * Used to determine if wide RHP should be displayed optimistically.
     * It helps us open expense as wide, before it fully loads.
     */
    const isReportIDMarkedAsExpense = (0, react_1.useCallback)((reportID) => {
        return expenseReportIDs.has(reportID);
    }, [expenseReportIDs]);
    /**
     * Effect that shows/hides the expanded RHP progress based on the number of wide RHP routes.
     */
    (0, react_1.useEffect)(() => {
        if (wideRHPRouteKeys.length > 0) {
            expandedRHPProgress.setValue(1);
        }
        else {
            expandedRHPProgress.setValue(0);
        }
    }, [wideRHPRouteKeys.length]);
    /**
     * Effect that manages the secondary overlay animation and rendering state.
     */
    (0, react_1.useEffect)(() => {
        if (shouldShowSecondaryOverlay) {
            setShouldRenderSecondaryOverlay(true);
            react_native_1.Animated.timing(secondOverlayProgress, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
        else {
            react_native_1.Animated.timing(secondOverlayProgress, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start(() => {
                setShouldRenderSecondaryOverlay(false);
            });
        }
    }, [shouldShowSecondaryOverlay]);
    /**
     * Effect that handles responsive RHP width calculation when window dimensions change.
     * Listens for dimension changes and recalculates the optimal RHP width accordingly.
     */
    (0, react_1.useEffect)(() => {
        const handleDimensionChange = () => {
            const windowWidth = react_native_1.Dimensions.get('window').width;
            const newWidth = calculateReceiptPaneRHPWidth(windowWidth);
            receiptPaneRHPWidth.setValue(newWidth);
        };
        // Set initial value
        handleDimensionChange();
        // Add event listener for dimension changes
        const subscription = react_native_1.Dimensions.addEventListener('change', handleDimensionChange);
        // Cleanup subscription on unmount
        return () => subscription?.remove();
    }, []);
    const value = (0, react_1.useMemo)(() => ({
        expandedRHPProgress,
        wideRHPRouteKeys,
        showWideRHPVersion,
        cleanWideRHPRouteKey,
        secondOverlayProgress,
        shouldRenderSecondaryOverlay,
        dismissToWideReport,
        markReportIDAsExpense,
        isReportIDMarkedAsExpense,
    }), [wideRHPRouteKeys, showWideRHPVersion, cleanWideRHPRouteKey, shouldRenderSecondaryOverlay, dismissToWideReport, markReportIDAsExpense, isReportIDMarkedAsExpense]);
    return <WideRHPContext.Provider value={value}>{children}</WideRHPContext.Provider>;
}
/**
 * Hook that manages wide RHP display for a screen based on condition or optimistic state.
 * Automatically registers the route for wide RHP when condition is met or report is marked as expense.
 * Cleans up the route registration when the screen is removed.
 *
 * @param condition - Boolean condition determining if the screen should display as wide RHP
 */
function useShowWideRHPVersion(condition) {
    const navigation = (0, native_1.useNavigation)();
    const route = (0, native_1.useRoute)();
    const reportID = route.params && 'reportID' in route.params && typeof route.params.reportID === 'string' ? route.params.reportID : '';
    const { showWideRHPVersion, cleanWideRHPRouteKey, isReportIDMarkedAsExpense } = (0, react_1.useContext)(WideRHPContext);
    /**
     * Effect that sets up cleanup when the screen is about to be removed.
     * Uses InteractionManager to ensure cleanup happens after closing animation.
     */
    (0, react_1.useEffect)(() => {
        return navigation.addListener('beforeRemove', () => {
            react_native_1.InteractionManager.runAfterInteractions(() => {
                cleanWideRHPRouteKey(route);
            });
        });
    }, [cleanWideRHPRouteKey, navigation, route]);
    /**
     * Effect that determines whether to show wide RHP based on condition or optimistic state.
     * Shows wide RHP if either the condition is true OR the reportID is marked as an expense.
     */
    (0, react_1.useEffect)(() => {
        // Check if we should show wide RHP based on condition OR if reportID is in optimistic set
        const shouldShow = condition || (reportID && isReportIDMarkedAsExpense(reportID));
        if (!shouldShow) {
            return;
        }
        showWideRHPVersion(route);
    }, [condition, reportID, isReportIDMarkedAsExpense, route, showWideRHPVersion]);
}
WideRHPContextProvider.displayName = 'WideRHPContextProvider';
exports.default = WideRHPContextProvider;
