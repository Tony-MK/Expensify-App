"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollOffsetContext = void 0;
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const defaultValue = {
    saveScrollOffset: () => { },
    getScrollOffset: () => undefined,
    saveScrollIndex: () => { },
    getScrollIndex: () => undefined,
    cleanStaleScrollOffsets: () => { },
};
const ScrollOffsetContext = (0, react_1.createContext)(defaultValue);
exports.ScrollOffsetContext = ScrollOffsetContext;
/** This function is prepared to work with HOME and SEARCH screens. */
function getKey(route) {
    // Handle routes with direct policyID parameter (HOME screens)
    if (route.params && 'policyID' in route.params && typeof route.params.policyID === 'string') {
        return `${route.name}-${route.params.policyID}`;
    }
    // Handle SEARCH screens with query parameters
    if (route.name === SCREENS_1.default.SEARCH.ROOT && route.params && 'q' in route.params && typeof route.params.q === 'string') {
        // Encode the query to handle spaces and special characters
        const encodedQuery = encodeURIComponent(route.params.q);
        return `${route.name}-${encodedQuery}`;
    }
    // For other routes, just use route name
    return `${route.name}-global`;
}
function ScrollOffsetContextProvider({ children }) {
    const [priorityMode] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_PRIORITY_MODE, { canBeMissing: true });
    const scrollOffsetsRef = (0, react_1.useRef)({});
    const previousPriorityMode = (0, usePrevious_1.default)(priorityMode);
    (0, react_1.useEffect)(() => {
        if (previousPriorityMode === null || previousPriorityMode === priorityMode) {
            return;
        }
        // If the priority mode changes, we need to clear the scroll offsets for the home and search screens because it affects the size of the elements and scroll positions wouldn't be correct.
        for (const key of Object.keys(scrollOffsetsRef.current)) {
            if (key.includes(SCREENS_1.default.HOME) || key.includes(SCREENS_1.default.SEARCH.ROOT)) {
                delete scrollOffsetsRef.current[key];
            }
        }
    }, [priorityMode, previousPriorityMode]);
    const saveScrollOffset = (0, react_1.useCallback)((route, scrollOffset) => {
        scrollOffsetsRef.current[getKey(route)] = scrollOffset;
    }, []);
    const getScrollOffset = (0, react_1.useCallback)((route) => {
        if (!scrollOffsetsRef.current) {
            return;
        }
        return scrollOffsetsRef.current[getKey(route)];
    }, []);
    const cleanScrollOffsets = (0, react_1.useCallback)((keys, shouldDelete) => {
        keys.forEach((key) => {
            if (!shouldDelete(key)) {
                return;
            }
            delete scrollOffsetsRef.current[key];
        });
    }, []);
    const cleanStaleScrollOffsets = (0, react_1.useCallback)((state) => {
        const sidebarRoutes = state.routes.filter((route) => (0, isNavigatorName_1.isSidebarScreenName)(route.name));
        const existingScreenKeys = sidebarRoutes.map(getKey);
        const focusedRoute = (0, native_1.findFocusedRoute)(state);
        const routeName = focusedRoute?.name;
        const isSearchScreen = routeName === SCREENS_1.default.SEARCH.ROOT;
        const isSearchMoneyRequestReport = routeName === SCREENS_1.default.SEARCH.MONEY_REQUEST_REPORT || routeName === SCREENS_1.default.SEARCH.REPORT_RHP;
        const scrollOffsetKeys = Object.keys(scrollOffsetsRef.current);
        if (isSearchScreen || isSearchMoneyRequestReport) {
            const currentKey = focusedRoute ? getKey(focusedRoute) : null;
            cleanScrollOffsets(scrollOffsetKeys, (key) => key.startsWith(SCREENS_1.default.SEARCH.ROOT) && key !== currentKey && !isSearchMoneyRequestReport);
            return;
        }
        cleanScrollOffsets(scrollOffsetKeys, (key) => !existingScreenKeys.includes(key));
    }, [cleanScrollOffsets]);
    const saveScrollIndex = (0, react_1.useCallback)((route, scrollIndex) => {
        scrollOffsetsRef.current[getKey(route)] = scrollIndex;
    }, []);
    const getScrollIndex = (0, react_1.useCallback)((route) => {
        if (!scrollOffsetsRef.current) {
            return;
        }
        return scrollOffsetsRef.current[getKey(route)];
    }, []);
    const contextValue = (0, react_1.useMemo)(() => ({
        saveScrollOffset,
        getScrollOffset,
        cleanStaleScrollOffsets,
        saveScrollIndex,
        getScrollIndex,
    }), [saveScrollOffset, getScrollOffset, cleanStaleScrollOffsets, saveScrollIndex, getScrollIndex]);
    return <ScrollOffsetContext.Provider value={contextValue}>{children}</ScrollOffsetContext.Provider>;
}
exports.default = ScrollOffsetContextProvider;
