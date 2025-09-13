"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
const SCREENS_WITH_NAVIGATION_TAB_BAR_1 = require("./SCREENS_WITH_NAVIGATION_TAB_BAR");
function getIsScreenWithNavigationTabBarFocused(state) {
    const focusedRoute = (0, native_1.findFocusedRoute)(state);
    // We are checking if the focused route is a split navigator because there may be a brief moment where the navigator doesn't have state yet.
    // That mens we don't have screen with bottom tab focused. This caused glitching.
    return SCREENS_WITH_NAVIGATION_TAB_BAR_1.default.includes(focusedRoute?.name ?? '') || (0, isNavigatorName_1.isSplitNavigatorName)(focusedRoute?.name);
}
exports.default = getIsScreenWithNavigationTabBarFocused;
