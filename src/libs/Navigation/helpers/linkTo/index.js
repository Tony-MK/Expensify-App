"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = linkTo;
const core_1 = require("@react-navigation/core");
const native_1 = require("@react-navigation/native");
const getAdaptedStateFromPath_1 = require("@libs/Navigation/helpers/getAdaptedStateFromPath");
const getStateFromPath_1 = require("@libs/Navigation/helpers/getStateFromPath");
const normalizePath_1 = require("@libs/Navigation/helpers/normalizePath");
const linkingConfig_1 = require("@libs/Navigation/linkingConfig");
const ObjectUtils_1 = require("@libs/ObjectUtils");
const getMatchingNewRoute_1 = require("@navigation/helpers/getMatchingNewRoute");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const SCREENS_1 = require("@src/SCREENS");
const getMinimalAction_1 = require("./getMinimalAction");
const defaultLinkToOptions = {
    forceReplace: false,
};
function areNamesAndParamsEqual(currentState, stateFromPath) {
    const currentFocusedRoute = (0, native_1.findFocusedRoute)(currentState);
    const targetFocusedRoute = (0, native_1.findFocusedRoute)(stateFromPath);
    const areNamesEqual = currentFocusedRoute?.name === targetFocusedRoute?.name;
    const areParamsEqual = (0, ObjectUtils_1.shallowCompare)(currentFocusedRoute?.params, targetFocusedRoute?.params);
    return areNamesEqual && areParamsEqual;
}
function arePathAndBackToEqual(stateFromPath) {
    const focusedRouteFromPath = (0, native_1.findFocusedRoute)(stateFromPath);
    const params = focusedRouteFromPath?.params ?? {};
    if (!focusedRouteFromPath?.path || !('backTo' in params) || !params.backTo || typeof params.backTo !== 'string') {
        return false;
    }
    let cleanedPath = focusedRouteFromPath.path.replace(/\?.*/, '');
    let cleanedBackTo = params.backTo.replace(/\?.*/, '');
    cleanedPath = cleanedPath.endsWith('/') ? cleanedPath.slice(0, -1) : cleanedPath;
    cleanedBackTo = cleanedBackTo.endsWith('/') ? cleanedBackTo.slice(0, -1) : cleanedBackTo;
    return cleanedPath === cleanedBackTo;
}
function shouldCheckFullScreenRouteMatching(action) {
    return action !== undefined && action.type === 'PUSH' && action.payload.name === NAVIGATORS_1.default.RIGHT_MODAL_NAVIGATOR;
}
function isNavigatingToAttachmentScreen(focusedRouteName) {
    return focusedRouteName === SCREENS_1.default.ATTACHMENTS;
}
function isNavigatingToReportWithSameReportID(currentRoute, newRoute) {
    if (currentRoute.name !== SCREENS_1.default.REPORT || newRoute.name !== SCREENS_1.default.REPORT) {
        return false;
    }
    const currentParams = currentRoute.params;
    const newParams = newRoute?.params;
    return currentParams?.reportID === newParams?.reportID;
}
function linkTo(navigation, path, options) {
    if (!navigation) {
        throw new Error("Couldn't find a navigation object. Is your component inside a screen in a navigator?");
    }
    // We know that the options are always defined because we have default options.
    const { forceReplace } = { ...defaultLinkToOptions, ...options };
    const normalizedPath = (0, normalizePath_1.default)(path);
    const normalizedPathAfterRedirection = ((0, getMatchingNewRoute_1.default)(normalizedPath) ?? normalizedPath);
    // This is the state generated with the default getStateFromPath function.
    // It won't include the whole state that will be generated for this path but the focused route will be correct.
    // It is necessary because getActionFromState will generate RESET action for whole state generated with our custom getStateFromPath function.
    const stateFromPath = (0, getStateFromPath_1.default)(normalizedPathAfterRedirection);
    const currentState = navigation.getRootState();
    const focusedRouteFromPath = (0, native_1.findFocusedRoute)(stateFromPath);
    const currentFocusedRoute = (0, native_1.findFocusedRoute)(currentState);
    // For type safety. It shouldn't ever happen.
    if (!focusedRouteFromPath || !currentFocusedRoute) {
        return;
    }
    const action = (0, core_1.getActionFromState)(stateFromPath, linkingConfig_1.linkingConfig.config);
    // If there is no action, just reset the whole state.
    if (!action) {
        navigation.resetRoot(stateFromPath);
        return;
    }
    // We don't want to dispatch action to push/replace with exactly the same route that is already focused.
    if (areNamesAndParamsEqual(currentState, stateFromPath) || arePathAndBackToEqual(stateFromPath)) {
        return;
    }
    if (forceReplace) {
        action.type = CONST_1.default.NAVIGATION.ACTION_TYPE.REPLACE;
    }
    // Attachment screen - This is a special case. We want to navigate to it instead of push. If there is no screen on the stack, it will be pushed.
    // If not, it will be replaced. This way, navigating between one attachment screen and another won't be added to the browser history.
    // Report screen - Also a special case. If we are navigating to the report with same reportID we want to replace it (navigate will do that).
    // This covers the case when we open a specific message in report (reportActionID).
    else if (action.type === CONST_1.default.NAVIGATION.ACTION_TYPE.NAVIGATE &&
        !isNavigatingToAttachmentScreen(focusedRouteFromPath?.name) &&
        !isNavigatingToReportWithSameReportID(currentFocusedRoute, focusedRouteFromPath)) {
        // We want to PUSH by default to add entries to the browser history.
        action.type = CONST_1.default.NAVIGATION.ACTION_TYPE.PUSH;
    }
    // If we deep link to a RHP page, we want to make sure we have the correct full screen route under the overlay.
    if (shouldCheckFullScreenRouteMatching(action)) {
        const newFocusedRoute = (0, native_1.findFocusedRoute)(stateFromPath);
        if (newFocusedRoute) {
            const matchingFullScreenRoute = (0, getAdaptedStateFromPath_1.getMatchingFullScreenRoute)(newFocusedRoute);
            const lastFullScreenRoute = currentState.routes.findLast((route) => (0, getAdaptedStateFromPath_1.isFullScreenName)(route.name));
            if (matchingFullScreenRoute && lastFullScreenRoute && matchingFullScreenRoute.name !== lastFullScreenRoute.name) {
                const isMatchingRoutePreloaded = currentState.preloadedRoutes.some((preloadedRoute) => preloadedRoute.name === matchingFullScreenRoute.name);
                if (isMatchingRoutePreloaded) {
                    navigation.dispatch(native_1.StackActions.push(matchingFullScreenRoute.name));
                }
                else {
                    const lastRouteInMatchingFullScreen = matchingFullScreenRoute.state?.routes?.at(-1);
                    const additionalAction = native_1.StackActions.push(matchingFullScreenRoute.name, {
                        screen: lastRouteInMatchingFullScreen?.name,
                        params: lastRouteInMatchingFullScreen?.params,
                    });
                    navigation.dispatch(additionalAction);
                }
            }
        }
    }
    const { action: minimalAction } = (0, getMinimalAction_1.default)(action, navigation.getRootState());
    navigation.dispatch(minimalAction);
}
