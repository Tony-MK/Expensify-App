"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceSplitsWithoutEnteringAnimation = exports.screensWithEnteringAnimation = void 0;
exports.handleDismissModalAction = handleDismissModalAction;
exports.handleNavigatingToModalFromModal = handleNavigatingToModalFromModal;
exports.handleOpenWorkspaceSplitAction = handleOpenWorkspaceSplitAction;
exports.handlePushFullscreenAction = handlePushFullscreenAction;
exports.handleReplaceReportsSplitNavigatorAction = handleReplaceReportsSplitNavigatorAction;
exports.handleToggleSidePanelWithHistoryAction = handleToggleSidePanelWithHistoryAction;
const native_1 = require("@react-navigation/native");
const SCREENS_WITH_NAVIGATION_TAB_BAR_1 = require("@components/Navigation/TopLevelNavigationTabBar/SCREENS_WITH_NAVIGATION_TAB_BAR");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const Log_1 = require("@libs/Log");
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
const RELATIONS_1 = require("@libs/Navigation/linkingConfig/RELATIONS");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
const MODAL_ROUTES_TO_DISMISS = [
    NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR,
    NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR,
    NAVIGATORS_1.default.ONBOARDING_MODAL_NAVIGATOR,
    NAVIGATORS_1.default.FEATURE_TRAINING_MODAL_NAVIGATOR,
    NAVIGATORS_1.default.SHARE_MODAL_NAVIGATOR,
    NAVIGATORS_1.default.TEST_DRIVE_MODAL_NAVIGATOR,
    SCREENS_1.default.NOT_FOUND,
    SCREENS_1.default.ATTACHMENTS,
    SCREENS_1.default.TRANSACTION_RECEIPT,
    SCREENS_1.default.MONEY_REQUEST.RECEIPT_PREVIEW,
    SCREENS_1.default.PROFILE_AVATAR,
    SCREENS_1.default.WORKSPACE_AVATAR,
    SCREENS_1.default.REPORT_AVATAR,
    SCREENS_1.default.CONCIERGE,
];
const workspaceSplitsWithoutEnteringAnimation = new Set();
exports.workspaceSplitsWithoutEnteringAnimation = workspaceSplitsWithoutEnteringAnimation;
const screensWithEnteringAnimation = new Set();
exports.screensWithEnteringAnimation = screensWithEnteringAnimation;
/**
 * Handles the OPEN_WORKSPACE_SPLIT action.
 * If the user is on other tab than workspaces and the workspace split is "remembered", this action will be called after pressing the settings tab.
 * It will push the workspace hub split navigator first and then push the workspace split navigator.
 * This allows the user to swipe back on the iOS to the workspace hub split navigator underneath.
 */
function handleOpenWorkspaceSplitAction(state, action, configOptions, stackRouter) {
    const actionToPushWorkspacesList = native_1.StackActions.push(SCREENS_1.default.WORKSPACES_LIST);
    const stateWithWorkspacesList = stackRouter.getStateForAction(state, actionToPushWorkspacesList, configOptions);
    if (!stateWithWorkspacesList) {
        Log_1.default.hmmm('[handleOpenWorkspaceSplitAction] WorkspacesList has not been found in the navigation state.');
        return null;
    }
    const actionToPushWorkspaceSplitNavigator = native_1.StackActions.push(NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR, {
        screen: action.payload.screenName,
        params: {
            policyID: action.payload.policyID,
        },
    });
    const rehydratedStateWithWorkspacesList = stackRouter.getRehydratedState(stateWithWorkspacesList, configOptions);
    const stateWithWorkspaceSplitNavigator = stackRouter.getStateForAction(rehydratedStateWithWorkspacesList, actionToPushWorkspaceSplitNavigator, configOptions);
    if (!stateWithWorkspaceSplitNavigator) {
        Log_1.default.hmmm('[handleOpenWorkspaceSplitAction] WorkspaceSplitNavigator has not been found in the navigation state.');
        return null;
    }
    const lastFullScreenRoute = stateWithWorkspaceSplitNavigator.routes.at(-1);
    if (lastFullScreenRoute?.key) {
        // If the user opened the workspace split navigator from a different tab, we don't want to animate the entering transition.
        // To make it feel like bottom tab navigator.
        workspaceSplitsWithoutEnteringAnimation.add(lastFullScreenRoute.key);
    }
    return stateWithWorkspaceSplitNavigator;
}
function handlePushFullscreenAction(state, action, configOptions, stackRouter) {
    const targetScreen = action.payload?.params && 'screen' in action.payload.params ? action.payload?.params?.screen : undefined;
    const navigatorName = action.payload.name;
    // If we navigate to the central screen of the split navigator, we need to filter this navigator from preloadedRoutes to remove a sidebar screen from the state
    const shouldFilterPreloadedRoutes = (0, getIsNarrowLayout_1.default)() &&
        (0, isNavigatorName_1.isSplitNavigatorName)(navigatorName) &&
        targetScreen !== RELATIONS_1.SPLIT_TO_SIDEBAR[navigatorName] &&
        state.preloadedRoutes?.some((preloadedRoute) => preloadedRoute.name === navigatorName);
    const adjustedState = shouldFilterPreloadedRoutes ? { ...state, preloadedRoutes: state.preloadedRoutes.filter((preloadedRoute) => preloadedRoute.name !== navigatorName) } : state;
    const stateWithNavigator = stackRouter.getStateForAction(adjustedState, action, configOptions);
    if (!stateWithNavigator) {
        Log_1.default.hmmm(`[handlePushAction] ${navigatorName} has not been found in the navigation state.`);
        return null;
    }
    const lastFullScreenRoute = stateWithNavigator.routes.at(-1);
    // Transitioning to all central screens in each split should be animated
    if (lastFullScreenRoute?.key && targetScreen && !SCREENS_WITH_NAVIGATION_TAB_BAR_1.default.includes(targetScreen)) {
        screensWithEnteringAnimation.add(lastFullScreenRoute.key);
    }
    return stateWithNavigator;
}
function handleReplaceReportsSplitNavigatorAction(state, action, configOptions, stackRouter) {
    const stateWithReportsSplitNavigator = stackRouter.getStateForAction(state, action, configOptions);
    if (!stateWithReportsSplitNavigator) {
        Log_1.default.hmmm('[handleReplaceReportsSplitNavigatorAction] ReportsSplitNavigator has not been found in the navigation state.');
        return null;
    }
    const lastReportsSplitNavigator = stateWithReportsSplitNavigator.routes.at(-1);
    // ReportScreen should always be opened with an animation when replacing the navigator
    if (lastReportsSplitNavigator?.key) {
        screensWithEnteringAnimation.add(lastReportsSplitNavigator.key);
    }
    return stateWithReportsSplitNavigator;
}
/**
 * Handles the DISMISS_MODAL action.
 * If the last route is a modal route, it has to be popped from the navigation stack.
 */
function handleDismissModalAction(state, configOptions, stackRouter) {
    const lastRoute = state.routes.at(-1);
    const newAction = native_1.StackActions.pop();
    if (!lastRoute?.name || !MODAL_ROUTES_TO_DISMISS.includes(lastRoute?.name)) {
        Log_1.default.hmmm('[Navigation] dismissModal failed because there is no modal stack to dismiss');
        return null;
    }
    return stackRouter.getStateForAction(state, newAction, configOptions);
}
/**
 * Handles opening a new modal navigator from an existing one.
 */
function handleNavigatingToModalFromModal(state, action, configOptions, stackRouter) {
    const modifiedState = { ...state, routes: state.routes.slice(0, -1), index: state.index !== 0 ? state.index - 1 : 0 };
    return stackRouter.getStateForAction(modifiedState, action, configOptions);
}
function handleToggleSidePanelWithHistoryAction(state, action) {
    // This shouldn't ever happen as the history should be always defined. It's for type safety.
    if (!state?.history) {
        return state;
    }
    // If it's set to true, we need to add the side panel history entry if it's not already there.
    if (action.payload.isVisible && state.history.at(-1) !== CONST_1.default.NAVIGATION.CUSTOM_HISTORY_ENTRY_SIDE_PANEL) {
        return { ...state, history: [...state.history, CONST_1.default.NAVIGATION.CUSTOM_HISTORY_ENTRY_SIDE_PANEL] };
    }
    // If it's set to false, we need to remove the side panel history entry if it's there.
    if (!action.payload.isVisible) {
        return { ...state, history: state.history.filter((entry) => entry !== CONST_1.default.NAVIGATION.CUSTOM_HISTORY_ENTRY_SIDE_PANEL) };
    }
    // Else, do not change history.
    return state;
}
