"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollOffsetContext = void 0;
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var useOnyx_1 = require("@hooks/useOnyx");
var usePrevious_1 = require("@hooks/usePrevious");
var isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var SCREENS_1 = require("@src/SCREENS");
var defaultValue = {
    saveScrollOffset: function () { },
    getScrollOffset: function () { return undefined; },
    saveScrollIndex: function () { },
    getScrollIndex: function () { return undefined; },
    cleanStaleScrollOffsets: function () { },
};
var ScrollOffsetContext = (0, react_1.createContext)(defaultValue);
exports.ScrollOffsetContext = ScrollOffsetContext;
/** This function is prepared to work with HOME and SEARCH screens. */
function getKey(route) {
    // Handle routes with direct policyID parameter (HOME screens)
    if (route.params && 'policyID' in route.params && typeof route.params.policyID === 'string') {
        return "".concat(route.name, "-").concat(route.params.policyID);
    }
    // Handle SEARCH screens with query parameters
    if (route.name === SCREENS_1.default.SEARCH.ROOT && route.params && 'q' in route.params && typeof route.params.q === 'string') {
        // Encode the query to handle spaces and special characters
        var encodedQuery = encodeURIComponent(route.params.q);
        return "".concat(route.name, "-").concat(encodedQuery);
    }
    // For other routes, just use route name
    return "".concat(route.name, "-global");
}
function ScrollOffsetContextProvider(_a) {
    var children = _a.children;
    var priorityMode = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIORITY_MODE, { canBeMissing: true })[0];
    var scrollOffsetsRef = (0, react_1.useRef)({});
    var previousPriorityMode = (0, usePrevious_1.default)(priorityMode);
    (0, react_1.useEffect)(function () {
        if (previousPriorityMode === null || previousPriorityMode === priorityMode) {
            return;
        }
        // If the priority mode changes, we need to clear the scroll offsets for the home and search screens because it affects the size of the elements and scroll positions wouldn't be correct.
        for (var _i = 0, _a = Object.keys(scrollOffsetsRef.current); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key.includes(SCREENS_1.default.HOME) || key.includes(SCREENS_1.default.SEARCH.ROOT)) {
                delete scrollOffsetsRef.current[key];
            }
        }
    }, [priorityMode, previousPriorityMode]);
    var saveScrollOffset = (0, react_1.useCallback)(function (route, scrollOffset) {
        scrollOffsetsRef.current[getKey(route)] = scrollOffset;
    }, []);
    var getScrollOffset = (0, react_1.useCallback)(function (route) {
        if (!scrollOffsetsRef.current) {
            return;
        }
        return scrollOffsetsRef.current[getKey(route)];
    }, []);
    var cleanScrollOffsets = (0, react_1.useCallback)(function (keys, shouldDelete) {
        keys.forEach(function (key) {
            if (!shouldDelete(key)) {
                return;
            }
            delete scrollOffsetsRef.current[key];
        });
    }, []);
    var cleanStaleScrollOffsets = (0, react_1.useCallback)(function (state) {
        var sidebarRoutes = state.routes.filter(function (route) { return (0, isNavigatorName_1.isSidebarScreenName)(route.name); });
        var existingScreenKeys = sidebarRoutes.map(getKey);
        var focusedRoute = (0, native_1.findFocusedRoute)(state);
        var routeName = focusedRoute === null || focusedRoute === void 0 ? void 0 : focusedRoute.name;
        var isSearchScreen = routeName === SCREENS_1.default.SEARCH.ROOT;
        var isSearchMoneyRequestReport = routeName === SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT || routeName === SCREENS_1.default.SEARCH.REPORT_RHP;
        var scrollOffsetKeys = Object.keys(scrollOffsetsRef.current);
        if (isSearchScreen || isSearchMoneyRequestReport) {
            var currentKey_1 = focusedRoute ? getKey(focusedRoute) : null;
            cleanScrollOffsets(scrollOffsetKeys, function (key) { return key.startsWith(SCREENS_1.default.SEARCH.ROOT) && key !== currentKey_1 && !isSearchMoneyRequestReport; });
            return;
        }
        cleanScrollOffsets(scrollOffsetKeys, function (key) { return !existingScreenKeys.includes(key); });
    }, [cleanScrollOffsets]);
    var saveScrollIndex = (0, react_1.useCallback)(function (route, scrollIndex) {
        scrollOffsetsRef.current[getKey(route)] = scrollIndex;
    }, []);
    var getScrollIndex = (0, react_1.useCallback)(function (route) {
        if (!scrollOffsetsRef.current) {
            return;
        }
        return scrollOffsetsRef.current[getKey(route)];
    }, []);
    var contextValue = (0, react_1.useMemo)(function () { return ({
        saveScrollOffset: saveScrollOffset,
        getScrollOffset: getScrollOffset,
        cleanStaleScrollOffsets: cleanStaleScrollOffsets,
        saveScrollIndex: saveScrollIndex,
        getScrollIndex: getScrollIndex,
    }); }, [saveScrollOffset, getScrollOffset, cleanStaleScrollOffsets, saveScrollIndex, getScrollIndex]);
    return <ScrollOffsetContext.Provider value={contextValue}>{children}</ScrollOffsetContext.Provider>;
}
exports.default = ScrollOffsetContextProvider;
