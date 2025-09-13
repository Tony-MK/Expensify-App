"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getAccountTabScreenToOpen;
const native_1 = require("@react-navigation/native");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const SCREENS_1 = require("@src/SCREENS");
const lastVisitedTabPathUtils_1 = require("./lastVisitedTabPathUtils");
/**
 * Returns the Settings screen that should be opened on the Account tab.
 */
function getAccountTabScreenToOpen(subscriptionPlan) {
    if ((0, getIsNarrowLayout_1.default)()) {
        return { screen: SCREENS_1.default.SETTINGS.ROOT };
    }
    const settingsTabState = (0, lastVisitedTabPathUtils_1.getSettingsTabStateFromSessionStorage)();
    if (!settingsTabState) {
        return { screen: SCREENS_1.default.SETTINGS.PROFILE.ROOT, params: {} };
    }
    const focusedRoute = (0, native_1.findFocusedRoute)(settingsTabState);
    if ((!subscriptionPlan && focusedRoute?.name === SCREENS_1.default.SETTINGS.SUBSCRIPTION.ROOT) || !focusedRoute) {
        return { screen: SCREENS_1.default.SETTINGS.PROFILE.ROOT, params: {} };
    }
    return { screen: focusedRoute.name };
}
