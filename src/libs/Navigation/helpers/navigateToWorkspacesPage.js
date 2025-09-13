"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceNavigationRouteState = void 0;
const interceptAnonymousUser_1 = require("@libs/interceptAnonymousUser");
const usePreserveNavigatorState_1 = require("@libs/Navigation/AppNavigator/createSplitNavigator/usePreserveNavigatorState");
const Navigation_1 = require("@libs/Navigation/Navigation");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
const PolicyUtils_1 = require("@libs/PolicyUtils");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const isNavigatorName_1 = require("./isNavigatorName");
const lastVisitedTabPathUtils_1 = require("./lastVisitedTabPathUtils");
// Gets the latest workspace navigation state, restoring from session or preserved state if needed.
const getWorkspaceNavigationRouteState = () => {
    const rootState = navigationRef_1.default.getRootState();
    // Only consider main (fullscreen) routes for top-level navigation context.
    const topmostFullScreenRoute = rootState?.routes?.findLast((route) => (0, isNavigatorName_1.isFullScreenName)(route.name));
    if (!topmostFullScreenRoute) {
        // No fullscreen route: not in a workspace context.
        return {};
    }
    // Prefer restoring workspace tab state from sessionStorage for accurate restoration.
    const workspacesTabStateFromSessionStorage = (0, lastVisitedTabPathUtils_1.getWorkspacesTabStateFromSessionStorage)() ?? rootState;
    const lastWorkspacesTabNavigatorRoute = workspacesTabStateFromSessionStorage?.routes.findLast((route) => (0, isNavigatorName_1.isWorkspacesTabScreenName)(route.name));
    let workspacesTabState = lastWorkspacesTabNavigatorRoute?.state;
    // Use preserved state if live state is missing (e.g. after a pop).
    if (!workspacesTabState && lastWorkspacesTabNavigatorRoute?.key) {
        workspacesTabState = (0, usePreserveNavigatorState_1.getPreservedNavigatorState)(lastWorkspacesTabNavigatorRoute.key);
    }
    return { lastWorkspacesTabNavigatorRoute, workspacesTabState, topmostFullScreenRoute };
};
exports.getWorkspaceNavigationRouteState = getWorkspaceNavigationRouteState;
// Navigates to the appropriate workspace tab or workspace list page.
const navigateToWorkspacesPage = ({ currentUserLogin, shouldUseNarrowLayout, policy }) => {
    const { lastWorkspacesTabNavigatorRoute, topmostFullScreenRoute } = getWorkspaceNavigationRouteState();
    if (!topmostFullScreenRoute || topmostFullScreenRoute.name === SCREENS_1.default.WORKSPACES_LIST) {
        // Not in a main workspace navigation context or the workspaces list page is already displayed, so do nothing.
        return;
    }
    if (topmostFullScreenRoute.name === NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR) {
        // Already inside a workspace: go back to the list.
        Navigation_1.default.goBack(ROUTES_1.default.WORKSPACES_LIST.route);
        return;
    }
    (0, interceptAnonymousUser_1.default)(() => {
        // No workspace found in nav state: go to list.
        if (!lastWorkspacesTabNavigatorRoute) {
            Navigation_1.default.navigate(ROUTES_1.default.WORKSPACES_LIST.route);
            return;
        }
        // Workspace route found: try to restore last workspace screen.
        if (lastWorkspacesTabNavigatorRoute.name === NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR) {
            const shouldShowPolicy = (0, PolicyUtils_1.shouldShowPolicy)(policy, false, currentUserLogin);
            const isPendingDelete = (0, PolicyUtils_1.isPendingDeletePolicy)(policy);
            // Workspace is not accessible or is being deleted: go to list.
            if (!shouldShowPolicy || isPendingDelete) {
                Navigation_1.default.navigate(ROUTES_1.default.WORKSPACES_LIST.route);
                return;
            }
            // Restore to last-visited workspace tab or show initial tab
            if (policy?.id) {
                const workspaceScreenName = !shouldUseNarrowLayout ? (0, lastVisitedTabPathUtils_1.getLastVisitedWorkspaceTabScreen)() : SCREENS_1.default.WORKSPACE.INITIAL;
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
