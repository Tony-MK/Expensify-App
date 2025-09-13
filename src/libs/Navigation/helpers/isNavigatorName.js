"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFullScreenName = isFullScreenName;
exports.isOnboardingFlowName = isOnboardingFlowName;
exports.isSidebarScreenName = isSidebarScreenName;
exports.isSplitNavigatorName = isSplitNavigatorName;
exports.isWorkspacesTabScreenName = isWorkspacesTabScreenName;
var RELATIONS_1 = require("@libs/Navigation/linkingConfig/RELATIONS");
var NAVIGATORS_1 = require("@src/NAVIGATORS");
var SCREENS_1 = require("@src/SCREENS");
var FULL_SCREENS_SET = new Set(__spreadArray(__spreadArray([], Object.values(RELATIONS_1.SIDEBAR_TO_SPLIT), true), [NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR, SCREENS_1.default.WORKSPACES_LIST], false));
var SIDEBARS_SET = new Set(Object.values(RELATIONS_1.SPLIT_TO_SIDEBAR));
var ONBOARDING_SCREENS_SET = new Set(Object.values(SCREENS_1.default.ONBOARDING));
var SPLIT_NAVIGATORS_SET = new Set(Object.values(RELATIONS_1.SIDEBAR_TO_SPLIT));
var WORKSPACES_TAB_SET = new Set(Object.values([NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR, SCREENS_1.default.WORKSPACES_LIST]));
/**
 * Functions defined below are used to check whether a screen belongs to a specific group.
 * It is mainly used to filter routes in the navigation state.
 */
function checkIfScreenHasMatchingNameToSetValues(screen, set) {
    if (!screen) {
        return false;
    }
    return set.has(screen);
}
function isOnboardingFlowName(screen) {
    return checkIfScreenHasMatchingNameToSetValues(screen, ONBOARDING_SCREENS_SET);
}
function isSplitNavigatorName(screen) {
    return checkIfScreenHasMatchingNameToSetValues(screen, SPLIT_NAVIGATORS_SET);
}
function isFullScreenName(screen) {
    return checkIfScreenHasMatchingNameToSetValues(screen, FULL_SCREENS_SET);
}
function isSidebarScreenName(screen) {
    return checkIfScreenHasMatchingNameToSetValues(screen, SIDEBARS_SET);
}
function isWorkspacesTabScreenName(screen) {
    return checkIfScreenHasMatchingNameToSetValues(screen, WORKSPACES_TAB_SET);
}
