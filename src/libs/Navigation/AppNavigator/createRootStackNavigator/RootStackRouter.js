"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const Localize = require("@libs/Localize");
const isNavigatorName_1 = require("@libs/Navigation/helpers/isNavigatorName");
const isSideModalNavigator_1 = require("@libs/Navigation/helpers/isSideModalNavigator");
const Welcome = require("@userActions/Welcome");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const GetStateForActionHandlers_1 = require("./GetStateForActionHandlers");
const syncBrowserHistory_1 = require("./syncBrowserHistory");
function isOpenWorkspaceSplitAction(action) {
    return action.type === CONST_1.default.NAVIGATION.ACTION_TYPE.OPEN_WORKSPACE_SPLIT;
}
function isPushAction(action) {
    return action.type === CONST_1.default.NAVIGATION.ACTION_TYPE.PUSH;
}
function isReplaceAction(action) {
    return action.type === CONST_1.default.NAVIGATION.ACTION_TYPE.REPLACE;
}
function isDismissModalAction(action) {
    return action.type === CONST_1.default.NAVIGATION.ACTION_TYPE.DISMISS_MODAL;
}
function isToggleSidePanelWithHistoryAction(action) {
    return action.type === CONST_1.default.NAVIGATION.ACTION_TYPE.TOGGLE_SIDE_PANEL_WITH_HISTORY;
}
function isPreloadAction(action) {
    return action.type === CONST_1.default.NAVIGATION.ACTION_TYPE.PRELOAD;
}
function shouldPreventReset(state, action) {
    if (action.type !== CONST_1.default.NAVIGATION_ACTIONS.RESET || !action?.payload) {
        return false;
    }
    const currentFocusedRoute = (0, native_1.findFocusedRoute)(state);
    const targetFocusedRoute = (0, native_1.findFocusedRoute)(action?.payload);
    // We want to prevent the user from navigating back to a non-onboarding screen if they are currently on an onboarding screen
    if ((0, isNavigatorName_1.isOnboardingFlowName)(currentFocusedRoute?.name) && !(0, isNavigatorName_1.isOnboardingFlowName)(targetFocusedRoute?.name)) {
        Welcome.setOnboardingErrorMessage(Localize.translateLocal('onboarding.purpose.errorBackButton'));
        return true;
    }
    return false;
}
function isNavigatingToModalFromModal(state, action) {
    if (action.type !== CONST_1.default.NAVIGATION.ACTION_TYPE.PUSH) {
        return false;
    }
    const lastRoute = state.routes.at(-1);
    // If the last route is a side modal navigator and the generated minimal action want's to push a new side modal navigator that means they are different ones.
    // We want to dismiss the one that is currently on the top.
    return (0, isSideModalNavigator_1.default)(lastRoute?.name) && (0, isSideModalNavigator_1.default)(action.payload.name);
}
function RootStackRouter(options) {
    const stackRouter = (0, native_1.StackRouter)(options);
    return {
        ...stackRouter,
        getStateForAction(state, action, configOptions) {
            if (isPreloadAction(action) && action.payload.name === state.routes.at(-1)?.name) {
                return state;
            }
            if (isToggleSidePanelWithHistoryAction(action)) {
                return (0, GetStateForActionHandlers_1.handleToggleSidePanelWithHistoryAction)(state, action);
            }
            if (isOpenWorkspaceSplitAction(action)) {
                return (0, GetStateForActionHandlers_1.handleOpenWorkspaceSplitAction)(state, action, configOptions, stackRouter);
            }
            if (isDismissModalAction(action)) {
                return (0, GetStateForActionHandlers_1.handleDismissModalAction)(state, configOptions, stackRouter);
            }
            if (isReplaceAction(action) && action.payload.name === NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR) {
                return (0, GetStateForActionHandlers_1.handleReplaceReportsSplitNavigatorAction)(state, action, configOptions, stackRouter);
            }
            // When navigating to a specific workspace from WorkspaceListPage there should be entering animation for its sidebar (only case where we want animation for sidebar)
            // That's why we have a separate handler for opening it called handleOpenWorkspaceSplitAction
            // options for WorkspaceSplitNavigator can be found in AuthScreens.tsx > getWorkspaceSplitNavigatorOptions
            if (isPushAction(action) && (0, isNavigatorName_1.isFullScreenName)(action.payload.name) && action.payload.name !== NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR) {
                return (0, GetStateForActionHandlers_1.handlePushFullscreenAction)(state, action, configOptions, stackRouter);
            }
            // Don't let the user navigate back to a non-onboarding screen if they are currently on an onboarding screen and it's not finished.
            if (shouldPreventReset(state, action)) {
                (0, syncBrowserHistory_1.default)(state);
                return state;
            }
            if (isNavigatingToModalFromModal(state, action)) {
                return (0, GetStateForActionHandlers_1.handleNavigatingToModalFromModal)(state, action, configOptions, stackRouter);
            }
            return stackRouter.getStateForAction(state, action, configOptions);
        },
    };
}
exports.default = RootStackRouter;
