"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WideRHPContext = exports.secondOverlayProgress = exports.receiptPaneRHPWidth = exports.expandedRHPProgress = void 0;
exports.useShowWideRHPVersion = useShowWideRHPVersion;
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
// We use Animated for all functionality related to wide RHP to make it easier
// to interact with react-navigation components (e.g., CardContainer, interpolator), which also use Animated.
// eslint-disable-next-line no-restricted-imports
var react_native_1 = require("react-native");
var useRootNavigationState_1 = require("@hooks/useRootNavigationState");
var navigationRef_1 = require("@libs/Navigation/navigationRef");
var variables_1 = require("@styles/variables");
var NAVIGATORS_1 = require("@src/NAVIGATORS");
var SCREENS_1 = require("@src/SCREENS");
var default_1 = require("./default");
// 0 is folded/hidden, 1 is expanded/shown
var expandedRHPProgress = new react_native_1.Animated.Value(0);
exports.expandedRHPProgress = expandedRHPProgress;
var secondOverlayProgress = new react_native_1.Animated.Value(0);
exports.secondOverlayProgress = secondOverlayProgress;
var wideRHPMaxWidth = variables_1.default.receiptPaneRHPMaxWidth + variables_1.default.sideBarWidth;
/**
 * Calculates the optimal width for the receipt pane RHP based on window width.
 * Ensures the RHP doesn't exceed maximum width and maintains minimum responsive width.
 *
 * @param windowWidth - Current window width in pixels
 * @returns Calculated RHP width with constraints applied
 */
var calculateReceiptPaneRHPWidth = function (windowWidth) {
    var calculatedWidth = windowWidth < wideRHPMaxWidth ? variables_1.default.receiptPaneRHPMaxWidth - (wideRHPMaxWidth - windowWidth) : variables_1.default.receiptPaneRHPMaxWidth;
    return Math.max(calculatedWidth, variables_1.default.mobileResponsiveWidthBreakpoint - variables_1.default.sideBarWidth);
};
// This animated value is necessary to have a responsive RHP width for the range 800px to 840px.
var receiptPaneRHPWidth = new react_native_1.Animated.Value(calculateReceiptPaneRHPWidth(react_native_1.Dimensions.get('window').width));
exports.receiptPaneRHPWidth = receiptPaneRHPWidth;
var WideRHPContext = (0, react_1.createContext)(default_1.default);
exports.WideRHPContext = WideRHPContext;
function WideRHPContextProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)([]), wideRHPRouteKeys = _b[0], setWideRHPRouteKeys = _b[1];
    var _c = (0, react_1.useState)(false), shouldRenderSecondaryOverlay = _c[0], setShouldRenderSecondaryOverlay = _c[1];
    var _d = (0, react_1.useState)(new Set()), expenseReportIDs = _d[0], setExpenseReportIDs = _d[1];
    /**
     * Determines whether the secondary overlay should be displayed.
     * Shows second overlay when RHP is open and there is a wide RHP route open but there is another regular route on the top.
     */
    var shouldShowSecondaryOverlay = (0, useRootNavigationState_1.default)(function (state) {
        var _a;
        var focusedRoute = (0, native_1.findFocusedRoute)(state);
        var isRHPLastRootRoute = ((_a = state === null || state === void 0 ? void 0 : state.routes.at(-1)) === null || _a === void 0 ? void 0 : _a.name) === NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR;
        // Shouldn't ever happen but for type safety
        if (!(focusedRoute === null || focusedRoute === void 0 ? void 0 : focusedRoute.key)) {
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
    var showWideRHPVersion = (0, react_1.useCallback)(function (route) {
        if (!route.key) {
            console.error("The route passed to showWideRHPVersion should have the \"key\" property defined.");
            return;
        }
        var newKey = route.key;
        // If the key is in the array, don't add it.
        setWideRHPRouteKeys(function (prev) { return (prev.includes(newKey) ? prev : __spreadArray([newKey], prev, true)); });
    }, []);
    /**
     * Removes a route from the wide RHP route keys list, disabling wide RHP display for that route.
     */
    var cleanWideRHPRouteKey = (0, react_1.useCallback)(function (route) {
        if (!route.key) {
            console.error("The route passed to cleanWideRHPRouteKey should have the \"key\" property defined.");
            return;
        }
        var keyToRemove = route.key;
        // Do nothing, the key is not here
        if (!wideRHPRouteKeys.includes(keyToRemove)) {
            return;
        }
        setWideRHPRouteKeys(function (prev) { return prev.filter(function (key) { return key !== keyToRemove; }); });
    }, [wideRHPRouteKeys]);
    /**
     * Dismiss top layer modal and go back to the wide RHP.
     */
    var dismissToWideReport = (0, react_1.useCallback)(function () {
        var _a, _b;
        var rootState = navigationRef_1.default.getRootState();
        if (!rootState) {
            return;
        }
        var rhpStateKey = (_b = (_a = rootState.routes.findLast(function (route) { return route.name === NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR; })) === null || _a === void 0 ? void 0 : _a.state) === null || _b === void 0 ? void 0 : _b.key;
        if (!rhpStateKey) {
            return;
        }
        // In the current navigation structure, hardcoding popTo SCREENS.RIGHT_MODAL.SEARCH_REPORT works exactly as we want.
        // It may change in the future and we may need to improve this function to handle more complex configurations.
        navigationRef_1.default.dispatch(__assign(__assign({}, native_1.StackActions.popTo(SCREENS_1.default.RIGHT_MODAL.SEARCH_REPORT)), { target: rhpStateKey }));
    }, []);
    /**
     * Marks a report ID as an expense report, adding it to the expense reports set.
     * This enables optimistic wide RHP display for expense reports.
     * It helps us open expense as wide, before it fully loads.
     */
    var markReportIDAsExpense = (0, react_1.useCallback)(function (reportID) {
        setExpenseReportIDs(function (prev) {
            var newSet = new Set(prev);
            newSet.add(reportID);
            return newSet;
        });
    }, []);
    /**
     * Checks if a report ID is marked as an expense report.
     * Used to determine if wide RHP should be displayed optimistically.
     * It helps us open expense as wide, before it fully loads.
     */
    var isReportIDMarkedAsExpense = (0, react_1.useCallback)(function (reportID) {
        return expenseReportIDs.has(reportID);
    }, [expenseReportIDs]);
    /**
     * Effect that shows/hides the expanded RHP progress based on the number of wide RHP routes.
     */
    (0, react_1.useEffect)(function () {
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
    (0, react_1.useEffect)(function () {
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
            }).start(function () {
                setShouldRenderSecondaryOverlay(false);
            });
        }
    }, [shouldShowSecondaryOverlay]);
    /**
     * Effect that handles responsive RHP width calculation when window dimensions change.
     * Listens for dimension changes and recalculates the optimal RHP width accordingly.
     */
    (0, react_1.useEffect)(function () {
        var handleDimensionChange = function () {
            var windowWidth = react_native_1.Dimensions.get('window').width;
            var newWidth = calculateReceiptPaneRHPWidth(windowWidth);
            receiptPaneRHPWidth.setValue(newWidth);
        };
        // Set initial value
        handleDimensionChange();
        // Add event listener for dimension changes
        var subscription = react_native_1.Dimensions.addEventListener('change', handleDimensionChange);
        // Cleanup subscription on unmount
        return function () { return subscription === null || subscription === void 0 ? void 0 : subscription.remove(); };
    }, []);
    var value = (0, react_1.useMemo)(function () { return ({
        expandedRHPProgress: expandedRHPProgress,
        wideRHPRouteKeys: wideRHPRouteKeys,
        showWideRHPVersion: showWideRHPVersion,
        cleanWideRHPRouteKey: cleanWideRHPRouteKey,
        secondOverlayProgress: secondOverlayProgress,
        shouldRenderSecondaryOverlay: shouldRenderSecondaryOverlay,
        dismissToWideReport: dismissToWideReport,
        markReportIDAsExpense: markReportIDAsExpense,
        isReportIDMarkedAsExpense: isReportIDMarkedAsExpense,
    }); }, [wideRHPRouteKeys, showWideRHPVersion, cleanWideRHPRouteKey, shouldRenderSecondaryOverlay, dismissToWideReport, markReportIDAsExpense, isReportIDMarkedAsExpense]);
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
    var navigation = (0, native_1.useNavigation)();
    var route = (0, native_1.useRoute)();
    var reportID = route.params && 'reportID' in route.params && typeof route.params.reportID === 'string' ? route.params.reportID : '';
    var _a = (0, react_1.useContext)(WideRHPContext), showWideRHPVersion = _a.showWideRHPVersion, cleanWideRHPRouteKey = _a.cleanWideRHPRouteKey, isReportIDMarkedAsExpense = _a.isReportIDMarkedAsExpense;
    /**
     * Effect that sets up cleanup when the screen is about to be removed.
     * Uses InteractionManager to ensure cleanup happens after closing animation.
     */
    (0, react_1.useEffect)(function () {
        return navigation.addListener('beforeRemove', function () {
            react_native_1.InteractionManager.runAfterInteractions(function () {
                cleanWideRHPRouteKey(route);
            });
        });
    }, [cleanWideRHPRouteKey, navigation, route]);
    /**
     * Effect that determines whether to show wide RHP based on condition or optimistic state.
     * Shows wide RHP if either the condition is true OR the reportID is marked as an expense.
     */
    (0, react_1.useEffect)(function () {
        // Check if we should show wide RHP based on condition OR if reportID is in optimistic set
        var shouldShow = condition || (reportID && isReportIDMarkedAsExpense(reportID));
        if (!shouldShow) {
            return;
        }
        showWideRHPVersion(route);
    }, [condition, reportID, isReportIDMarkedAsExpense, route, showWideRHPVersion]);
}
WideRHPContextProvider.displayName = 'WideRHPContextProvider';
exports.default = WideRHPContextProvider;
