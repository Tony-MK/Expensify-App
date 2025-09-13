"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const NAVIGATION_TABS_1 = require("@components/Navigation/NavigationTabBar/NAVIGATION_TABS");
const useIsAuthenticated_1 = require("@hooks/useIsAuthenticated");
const useOnyx_1 = require("@hooks/useOnyx");
const useSubscriptionPlan_1 = require("@hooks/useSubscriptionPlan");
const Session_1 = require("@libs/actions/Session");
const getAccountTabScreenToOpen_1 = require("@libs/Navigation/helpers/getAccountTabScreenToOpen");
const lastVisitedTabPathUtils_1 = require("@libs/Navigation/helpers/lastVisitedTabPathUtils");
const RELATIONS_1 = require("@libs/Navigation/linkingConfig/RELATIONS");
const Navigation_1 = require("@libs/Navigation/Navigation");
const SearchQueryUtils_1 = require("@libs/SearchQueryUtils");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const SCREENS_1 = require("@src/SCREENS");
const usePreserveNavigatorState_1 = require("./createSplitNavigator/usePreserveNavigatorState");
// This timing is used to call the preload function after a tab change, when the initial tab screen has already been rendered.
const TIMING_TO_CALL_PRELOAD = 1000;
// Currently, only the Account and Workspaces tabs are preloaded. The remaining tabs will be supported soon.
const TABS_TO_PRELOAD = [NAVIGATION_TABS_1.default.SETTINGS, NAVIGATION_TABS_1.default.WORKSPACES];
function preloadWorkspacesTab(navigation) {
    const state = (0, lastVisitedTabPathUtils_1.getWorkspacesTabStateFromSessionStorage)() ?? navigation.getState();
    const lastWorkspacesSplitNavigator = state.routes.findLast((route) => route.name === NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR);
    if (lastWorkspacesSplitNavigator) {
        return;
    }
    navigation.preload(SCREENS_1.default.WORKSPACES_LIST, {});
}
function preloadReportsTab(navigation) {
    const lastSearchNavigator = navigation.getState().routes.findLast((route) => route.name === NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR);
    const lastSearchNavigatorState = lastSearchNavigator && lastSearchNavigator.key ? (0, usePreserveNavigatorState_1.getPreservedNavigatorState)(lastSearchNavigator?.key) : undefined;
    const lastSearchRoute = lastSearchNavigatorState?.routes.findLast((route) => route.name === SCREENS_1.default.SEARCH.ROOT);
    if (lastSearchRoute) {
        const { q, ...rest } = lastSearchRoute.params;
        const queryJSON = (0, SearchQueryUtils_1.buildSearchQueryJSON)(q);
        if (queryJSON) {
            const query = (0, SearchQueryUtils_1.buildSearchQueryString)(queryJSON);
            navigation.preload(NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR, { screen: SCREENS_1.default.SEARCH.ROOT, params: { q: query, ...rest } });
            return;
        }
    }
    navigation.preload(NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR, { screen: SCREENS_1.default.SEARCH.ROOT, params: { q: (0, SearchQueryUtils_1.buildCannedSearchQuery)() } });
}
function preloadAccountTab(navigation, subscriptionPlan) {
    const accountTabPayload = (0, getAccountTabScreenToOpen_1.default)(subscriptionPlan);
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
    return (preloadedRoute.name === NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR &&
        preloadedRoute.params &&
        `screen` in preloadedRoute.params &&
        preloadedRoute.params?.screen === SCREENS_1.default.SETTINGS.SUBSCRIPTION.ROOT);
}
/**
 * Hook that preloads all fullscreen navigators except the current one.
 * This helps improve performance by preloading navigators that might be needed soon.
 */
function usePreloadFullScreenNavigators() {
    const navigation = (0, native_1.useNavigation)();
    const route = (0, native_1.useRoute)();
    const state = navigation.getState();
    const preloadedRoutes = (0, react_1.useMemo)(() => state.preloadedRoutes, [state]);
    const subscriptionPlan = (0, useSubscriptionPlan_1.default)();
    const isAuthenticated = (0, useIsAuthenticated_1.default)();
    const hasPreloadedRef = (0, react_1.useRef)(false);
    const [isSingleNewDotEntry = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.HYBRID_APP, { selector: (hybridApp) => hybridApp?.isSingleNewDotEntry, canBeMissing: true });
    const hasSubscriptionPlanTurnedOff = (0, react_1.useMemo)(() => {
        return !subscriptionPlan && preloadedRoutes.some(isPreloadedRouteSubscriptionScreen);
    }, [subscriptionPlan, preloadedRoutes]);
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if (!hasSubscriptionPlanTurnedOff) {
            return;
        }
        navigation.reset({ ...navigation.getState(), preloadedRoutes: preloadedRoutes.filter((preloadedRoute) => preloadedRoute.name !== NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR) });
        Navigation_1.default.isNavigationReady().then(() => setTimeout(() => preloadAccountTab(navigation, subscriptionPlan), TIMING_TO_CALL_PRELOAD));
    }, [hasSubscriptionPlanTurnedOff, navigation, preloadedRoutes, subscriptionPlan]));
    (0, native_1.useFocusEffect)((0, react_1.useCallback)(() => {
        if ((0, Session_1.isAnonymousUser)() || !isAuthenticated || hasPreloadedRef.current || isSingleNewDotEntry) {
            return;
        }
        hasPreloadedRef.current = true;
        setTimeout(() => {
            TABS_TO_PRELOAD.filter((tabName) => {
                const isCurrentTab = RELATIONS_1.TAB_TO_FULLSCREEN[tabName].includes(route.name);
                const isRouteAlreadyPreloaded = preloadedRoutes.some((preloadedRoute) => RELATIONS_1.TAB_TO_FULLSCREEN[tabName].includes(preloadedRoute.name));
                return !isCurrentTab && !isRouteAlreadyPreloaded;
            }).forEach((tabName) => {
                preloadTab(tabName, navigation, subscriptionPlan);
            });
        }, TIMING_TO_CALL_PRELOAD);
    }, [isAuthenticated, isSingleNewDotEntry, route.name, preloadedRoutes, navigation, subscriptionPlan]));
}
exports.default = usePreloadFullScreenNavigators;
