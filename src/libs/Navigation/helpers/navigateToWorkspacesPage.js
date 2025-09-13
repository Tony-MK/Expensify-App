"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceNavigationRouteState = void 0;
var interceptAnonymousUser_1 = require("@libs/interceptAnonymousUser");
var usePreserveNavigatorState_1 = require("@libs/Navigation/AppNavigator/createSplitNavigator/usePreserveNavigatorState");
var Navigation_1 = require("@libs/Navigation/Navigation");
var navigationRef_1 = require("@libs/Navigation/navigationRef");
var PolicyUtils_1 = require("@libs/PolicyUtils");
var CONST_1 = require("@src/CONST");
var NAVIGATORS_1 = require("@src/NAVIGATORS");
var ROUTES_1 = require("@src/ROUTES");
var SCREENS_1 = require("@src/SCREENS");
var isNavigatorName_1 = require("./isNavigatorName");
var lastVisitedTabPathUtils_1 = require("./lastVisitedTabPathUtils");
// Gets the latest workspace navigation state, restoring from session or preserved state if needed.
var getWorkspaceNavigationRouteState = function () {
    var _a, _b;
    var rootState = navigationRef_1.default.getRootState();
    // Only consider main (fullscreen) routes for top-level navigation context.
    var topmostFullScreenRoute = (_a = rootState === null || rootState === void 0 ? void 0 : rootState.routes) === null || _a === void 0 ? void 0 : _a.findLast(function (route) { return (0, isNavigatorName_1.isFullScreenName)(route.name); });
    if (!topmostFullScreenRoute) {
        // No fullscreen route: not in a workspace context.
        return {};
    }
    // Prefer restoring workspace tab state from sessionStorage for accurate restoration.
    var workspacesTabStateFromSessionStorage = (_b = (0, lastVisitedTabPathUtils_1.getWorkspacesTabStateFromSessionStorage)()) !== null && _b !== void 0 ? _b : rootState;
    var lastWorkspacesTabNavigatorRoute = workspacesTabStateFromSessionStorage === null || workspacesTabStateFromSessionStorage === void 0 ? void 0 : workspacesTabStateFromSessionStorage.routes.findLast(function (route) { return (0, isNavigatorName_1.isWorkspacesTabScreenName)(route.name); });
    var workspacesTabState = lastWorkspacesTabNavigatorRoute === null || lastWorkspacesTabNavigatorRoute === void 0 ? void 0 : lastWorkspacesTabNavigatorRoute.state;
    // Use preserved state if live state is missing (e.g. after a pop).
    if (!workspacesTabState && (lastWorkspacesTabNavigatorRoute === null || lastWorkspacesTabNavigatorRoute === void 0 ? void 0 : lastWorkspacesTabNavigatorRoute.key)) {
        workspacesTabState = (0, usePreserveNavigatorState_1.getPreservedNavigatorState)(lastWorkspacesTabNavigatorRoute.key);
    }
    return { lastWorkspacesTabNavigatorRoute: lastWorkspacesTabNavigatorRoute, workspacesTabState: workspacesTabState, topmostFullScreenRoute: topmostFullScreenRoute };
};
exports.getWorkspaceNavigationRouteState = getWorkspaceNavigationRouteState;
// Navigates to the appropriate workspace tab or workspace list page.
var navigateToWorkspacesPage = function (_a) {
    var currentUserLogin = _a.currentUserLogin, shouldUseNarrowLayout = _a.shouldUseNarrowLayout, policy = _a.policy;
    var _b = getWorkspaceNavigationRouteState(), lastWorkspacesTabNavigatorRoute = _b.lastWorkspacesTabNavigatorRoute, topmostFullScreenRoute = _b.topmostFullScreenRoute;
    if (!topmostFullScreenRoute || topmostFullScreenRoute.name === SCREENS_1.default.WORKSPACES_LIST) {
        // Not in a main workspace navigation context or the workspaces list page is already displayed, so do nothing.
        return;
    }
    if (topmostFullScreenRoute.name === NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR) {
        // Already inside a workspace: go back to the list.
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACES_LIST.route);
        return;
    }
    (0, interceptAnonymousUser_1.default)(function () {
        // No workspace found in nav state: go to list.
        if (!lastWorkspacesTabNavigatorRoute) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACES_LIST.route);
            return;
        }
        // Workspace route found: try to restore last workspace screen.
        if (lastWorkspacesTabNavigatorRoute.name === NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR) {
            var shouldShowPolicy = (0, PolicyUtils_1.shouldShowPolicy)(policy, false, currentUserLogin);
            var isPendingDelete = (0, PolicyUtils_1.isPendingDeletePolicy)(policy);
            // Workspace is not accessible or is being deleted: go to list.
            if (!shouldShowPolicy || isPendingDelete) {
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACES_LIST.route);
                return;
            }
            // Restore to last-visited workspace tab or show initial tab
            if (policy === null || policy === void 0 ? void 0 : policy.id) {
                var workspaceScreenName = !shouldUseNarrowLayout ? (0, lastVisitedTabPathUtils_1.getLastVisitedWorkspaceTabScreen)() : SCREENS_1.default.WORKSPACE.INITIAL;
                navigationRef_1.default.dispatch({
                    type: CONST_1.default.NAVIGATION.ACTION_TYPE.OPEN_WORKSPACE_SPLIT,
                    payload: { policyID: policy.id, screenName: workspaceScreenName },
                });
            }
            return;
        }
        // Fallback: any other state, go to the list.
        Navigation_1.default.navigate(ROUTES_1.default.WORKSPACES_LIST.route);
    });
};
exports.default = navigateToWorkspacesPage;
