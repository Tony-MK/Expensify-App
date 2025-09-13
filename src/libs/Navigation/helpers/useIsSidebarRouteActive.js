"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const useRootNavigationState_1 = require("@hooks/useRootNavigationState");
const RELATIONS_1 = require("@libs/Navigation/linkingConfig/RELATIONS");
function useIsSidebarRouteActive(splitNavigatorName, isNarrowLayout) {
    const currentSplitNavigatorRoute = (0, useRootNavigationState_1.default)((rootState) => rootState?.routes.at(-1));
    if (currentSplitNavigatorRoute?.name !== splitNavigatorName) {
        return false;
    }
    const focusedRoute = (0, native_1.findFocusedRoute)(currentSplitNavigatorRoute?.state);
    const isSidebarRoute = focusedRoute?.name === RELATIONS_1.SPLIT_TO_SIDEBAR[splitNavigatorName];
    // To check if the sidebar is active on a narrow layout, we need to check if the focused route is the sidebar route
    if (isNarrowLayout) {
        return isSidebarRoute;
    }
    // On a wide layout, the sidebar is always focused when the split navigator is opened
    return true;
}
exports.default = useIsSidebarRouteActive;
