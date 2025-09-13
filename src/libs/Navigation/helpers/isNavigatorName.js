"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFullScreenName = isFullScreenName;
exports.isOnboardingFlowName = isOnboardingFlowName;
exports.isSidebarScreenName = isSidebarScreenName;
exports.isSplitNavigatorName = isSplitNavigatorName;
exports.isWorkspacesTabScreenName = isWorkspacesTabScreenName;
const RELATIONS_1 = require("@libs/Navigation/linkingConfig/RELATIONS");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
const FULL_SCREENS_SET = new Set([...Object.values(RELATIONS_1.SIDEBAR_TO_SPLIT), NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR, SCREENS_1.default.WORKSPACES_LIST]);
const SIDEBARS_SET = new Set(Object.values(RELATIONS_1.SPLIT_TO_SIDEBAR));
const ONBOARDING_SCREENS_SET = new Set(Object.values(SCREENS_1.default.ONBOARDING));
const SPLIT_NAVIGATORS_SET = new Set(Object.values(RELATIONS_1.SIDEBAR_TO_SPLIT));
const WORKSPACES_TAB_SET = new Set(Object.values([NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR, SCREENS_1.default.WORKSPACES_LIST]));
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
