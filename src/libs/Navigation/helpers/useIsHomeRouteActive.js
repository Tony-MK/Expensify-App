"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const useRootNavigationState_1 = require("@hooks/useRootNavigationState");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
/**
 * Determines if the current route is the Home route/screen
 */
function useIsHomeRouteActive(isNarrowLayout) {
    const focusedRoute = (0, native_1.useNavigationState)(native_1.findFocusedRoute);
    const navigationState = (0, useRootNavigationState_1.default)((x) => x);
    if (isNarrowLayout) {
        return focusedRoute?.name === SCREENS_1.default.HOME;
    }
    // On full width screens HOME is always a sidebar to the Reports Screen
    const isSplit = navigationState?.routes.at(-1)?.name === NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR;
    const isReport = focusedRoute?.name === SCREENS_1.default.REPORT;
    return isSplit && isReport;
}
exports.default = useIsHomeRouteActive;
