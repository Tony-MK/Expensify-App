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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var native_1 = require("@react-navigation/native");
var react_1 = require("react");
var NAVIGATION_TABS_1 = require("@components/Navigation/NavigationTabBar/NAVIGATION_TABS");
var useIsAuthenticated_1 = require("@hooks/useIsAuthenticated");
var useOnyx_1 = require("@hooks/useOnyx");
var useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
var Session_1 = require("@libs/actions/Session");
var getAccountTabScreenToOpen_1 = require("@libs/Navigation/helpers/getAccountTabScreenToOpen");
var lastVisitedTabPathUtils_1 = require("@libs/Navigation/helpers/lastVisitedTabPathUtils");
var RELATIONS_1 = require("@libs/Navigation/linkingConfig/RELATIONS");
var Navigation_1 = require("@libs/Navigation/Navigation");
var SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
var NAVIGATORS_1 = require("@src/NAVIGATORS");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var SCREENS_1 = require("@src/SCREENS");
var usePreserveNavigatorState_1 = require("./createSplitNavigator/usePreserveNavigatorState");
// This timing is used to call the preload function after a tab change, when the initial tab screen has already been rendered.
var TIMING_TO_CALL_PRELOAD = 1000;
// Currently, only the Account and Workspaces tabs are preloaded. The remaining tabs will be supported soon.
var TABS_TO_PRELOAD = [NAVIGATION_TABS_1.default.SETTINGS, NAVIGATION_TABS_1.default.WORKSPACES];
function preloadWorkspacesTab(navigation) {
    var _a;
    var state = (_a = (0, lastVisitedTabPathUtils_1.getWorkspacesTabStateFromSessionStorage)()) !== null && _a !== void 0 ? _a : navigation.getState();
    var lastWorkspacesSplitNavigator = state.routes.findLast(function (route) { return route.name === NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR; });
    if (lastWorkspacesSplitNavigator) {
        return;
    }
    navigation.preload(SCREENS_1.default.WORKSPACES_LIST, {});
}
function preloadReportsTab(navigation) {
    var lastSearchNavigator = navigation.getState().routes.findLast(function (route) { return route.name === NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR; });
    var lastSearchNavigatorState = lastSearchNavigator && lastSearchNavigator.key ? (0, usePreserveNavigatorState_1.getPreservedNavigatorState)(lastSearchNavigator === null || lastSearchNavigator === void 0 ? void 0 : lastSearchNavigator.key) : undefined;
    var lastSearchRoute = lastSearchNavigatorState === null || lastSearchNavigatorState === void 0 ? void 0 : lastSearchNavigatorState.routes.findLast(function (route) { return route.name === SCREENS_1.default.SEARCH.ROOT; });
    if (lastSearchRoute) {
        var _a = lastSearchRoute.params, q = _a.q, rest = __rest(_a, ["q"]);
        var queryJSON = (0, SearchQueryUtils_1.buildSearchQueryJSON)(q);
        if (queryJSON) {
            var query = (0, SearchQueryUtils_1.buildSearchQueryString)(queryJSON);
            navigation.preload(NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR, { screen: SCREENS_1.default.SEARCH.ROOT, params: __assign({ q: query }, rest) });
            return;
        }
    }
    navigation.preload(NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR, { screen: SCREENS_1.default.SEARCH.ROOT, params: { q: (0, SearchQueryUtils_1.buildCannedSearchQuery)() } });
}
function preloadAccountTab(navigation, subscriptionPlan) {
    var accountTabPayload = (0, getAccountTabScreenToOpen_1.default)(subscriptionPlan);
    navigation.preload(NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR, accountTabPayload);
}
function preloadInboxTab(navigation) {
    navigation.preload(NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR, { screen: SCREENS_1.default.HOME });
}
function preloadTab(tabName, navigation, subscriptionPlan) {
    switch (tabName) {
        case NAVIGATION_TABS_1.default.WORKSPACES:
            preloadWorkspacesTab(navigation);
            return;
        case NAVIGATION_TABS_1.default.SEARCH:
            preloadReportsTab(navigation);
            return;
        case NAVIGATION_TABS_1.default.SETTINGS:
            preloadAccountTab(navigation, subscriptionPlan);
            return;
        case NAVIGATION_TABS_1.default.HOME:
            preloadInboxTab(navigation);
            return;
        default:
            return undefined;
    }
}
function isPreloadedRouteSubscriptionScreen(preloadedRoute) {
    var _a;
    return (preloadedRoute.name === NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR &&
        preloadedRoute.params &&
        "screen" in preloadedRoute.params &&
        ((_a = preloadedRoute.params) === null || _a === void 0 ? void 0 : _a.screen) === SCREENS_1.default.SETTINGS.SUBSCRIPTION.ROOT);
}
/**
 * Hook that preloads all fullscreen navigators except the current one.
 * This helps improve performance by preloading navigators that might be needed soon.
 */
function usePreloadFullScreenNavigators() {
    var navigation = (0, native_1.useNavigation)();
    var route = (0, native_1.useRoute)();
    var state = navigation.getState();
    var preloadedRoutes = (0, react_1.useMemo)(function () { return state.preloadedRoutes; }, [state]);
    var subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    var isAuthenticated = (0, useIsAuthenticated_1.default)();
    var hasPreloadedRef = (0, react_1.useRef)(false);
    var _a = (0, useOnyx_1.default)(ONYXKEYS_1.default.HYBRID_APP, { selector: function (hybridApp) { return hybridApp === null || hybridApp === void 0 ? void 0 : hybridApp.isSingleNewDotEntry; }, canBeMissing: true })[0], isSingleNewDotEntry = _a === void 0 ? false : _a;
    var hasSubscriptionPlanTurnedOff = (0, react_1.useMemo)(function () {
        return !subscriptionPlan && preloadedRoutes.some(isPreloadedRouteSubscriptionScreen);
    }, [subscriptionPlan, preloadedRoutes]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(function () {
        if (!hasSubscriptionPlanTurnedOff) {
            return;
        }
        navigation.reset(__assign(__assign({}, navigation.getState()), { preloadedRoutes: preloadedRoutes.filter(function (preloadedRoute) { return preloadedRoute.name !== NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR; }) }));
        Navigation_1.default.isNavigationReady().then(function () { return setTimeout(function () { return preloadAccountTab(navigation, subscriptionPlan); }, TIMING_TO_CALL_PRELOAD); });
    }, [hasSubscriptionPlanTurnedOff, navigation, preloadedRoutes, subscriptionPlan]));
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(function () {
        if ((0, Session_1.isAnonymousUser)() || !isAuthenticated || hasPreloadedRef.current || isSingleNewDotEntry) {
            return;
        }
        hasPreloadedRef.current = true;
        setTimeout(function () {
            TABS_TO_PRELOAD.filter(function (tabName) {
                var isCurrentTab = RELATIONS_1.TAB_TO_FULLSCREEN[tabName].includes(route.name);
                var isRouteAlreadyPreloaded = preloadedRoutes.some(function (preloadedRoute) { return RELATIONS_1.TAB_TO_FULLSCREEN[tabName].includes(preloadedRoute.name); });
                return !isCurrentTab && !isRouteAlreadyPreloaded;
            }).forEach(function (tabName) {
                preloadTab(tabName, navigation, subscriptionPlan);
            });
        }, TIMING_TO_CALL_PRELOAD);
    }, [isAuthenticated, isSingleNewDotEntry, route.name, preloadedRoutes, navigation, subscriptionPlan]));
}
exports.default = usePreloadFullScreenNavigators;
