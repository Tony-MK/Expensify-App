"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFullScreenName = void 0;
exports.getMatchingFullScreenRoute = getMatchingFullScreenRoute;
const native_1 = require("@react-navigation/native");
const pick_1 = require("lodash/pick");
const react_native_onyx_1 = require("react-native-onyx");
const getInitialSplitNavigatorState_1 = require("@libs/Navigation/AppNavigator/createSplitNavigator/getInitialSplitNavigatorState");
const config_1 = require("@libs/Navigation/linkingConfig/config");
const RELATIONS_1 = require("@libs/Navigation/linkingConfig/RELATIONS");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const getMatchingNewRoute_1 = require("./getMatchingNewRoute");
const getParamsFromRoute_1 = require("./getParamsFromRoute");
const isNavigatorName_1 = require("./isNavigatorName");
Object.defineProperty(exports, "isFullScreenName", { enumerable: true, get: function () { return isNavigatorName_1.isFullScreenName; } });
const replacePathInNestedState_1 = require("./replacePathInNestedState");
let allReports;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReports = value;
    },
});
// The function getPathFromState that we are using in some places isn't working correctly without defined index.
const getRoutesWithIndex = (routes) => ({ routes, index: routes.length - 1 });
function isRouteWithBackToParam(route) {
    return route.params !== undefined && 'backTo' in route.params && typeof route.params.backTo === 'string';
}
function isRouteWithReportID(route) {
    return route.params !== undefined && 'reportID' in route.params && typeof route.params.reportID === 'string';
}
function getMatchingFullScreenRoute(route) {
    // Check for backTo param. One screen with different backTo value may need different screens visible under the overlay.
    if (isRouteWithBackToParam(route)) {
        const stateForBackTo = (0, native_1.getStateFromPath)(route.params.backTo, config_1.config);
        // This may happen if the backTo url is invalid.
        const lastRoute = stateForBackTo?.routes.at(-1);
        if (!stateForBackTo || !lastRoute || lastRoute.name === SCREENS_1.default.NOT_FOUND) {
            return undefined;
        }
        const isLastRouteFullScreen = (0, isNavigatorName_1.isFullScreenName)(lastRoute.name);
        // If the state for back to last route is a full screen route, we can use it
        if (isLastRouteFullScreen) {
            return lastRoute;
        }
        const focusedStateForBackToRoute = (0, native_1.findFocusedRoute)(stateForBackTo);
        if (!focusedStateForBackToRoute) {
            return undefined;
        }
        // If not, get the matching full screen route for the back to state.
        return getMatchingFullScreenRoute(focusedStateForBackToRoute);
    }
    if (RELATIONS_1.RHP_TO_SEARCH[route.name]) {
        const paramsFromRoute = (0, getParamsFromRoute_1.default)(RELATIONS_1.RHP_TO_SEARCH[route.name]);
        const searchRoute = {
            name: RELATIONS_1.RHP_TO_SEARCH[route.name],
            params: paramsFromRoute.length > 0 ? (0, pick_1.default)(route.params, paramsFromRoute) : undefined,
        };
        return {
            name: NAVIGATORS_1.default.SEARCH_FULLSCREEN_NAVIGATOR,
            state: getRoutesWithIndex([searchRoute]),
        };
    }
    if (RELATIONS_1.RHP_TO_SIDEBAR[route.name]) {
        return (0, getInitialSplitNavigatorState_1.default)({
            name: RELATIONS_1.RHP_TO_SIDEBAR[route.name],
        });
    }
    if (RELATIONS_1.RHP_TO_WORKSPACES_LIST[route.name]) {
        return {
            name: SCREENS_1.default.WORKSPACES_LIST,
            path: ROUTES_1.default.WORKSPACES_LIST.route,
        };
    }
    if (RELATIONS_1.RHP_TO_WORKSPACE[route.name]) {
        const paramsFromRoute = (0, getParamsFromRoute_1.default)(RELATIONS_1.RHP_TO_WORKSPACE[route.name]);
        return (0, getInitialSplitNavigatorState_1.default)({
            name: SCREENS_1.default.WORKSPACE.INITIAL,
            params: paramsFromRoute.length > 0 ? (0, pick_1.default)(route.params, paramsFromRoute) : undefined,
        }, {
            name: RELATIONS_1.RHP_TO_WORKSPACE[route.name],
            params: paramsFromRoute.length > 0 ? (0, pick_1.default)(route.params, paramsFromRoute) : undefined,
        });
    }
    if (RELATIONS_1.RHP_TO_SETTINGS[route.name]) {
        const paramsFromRoute = (0, getParamsFromRoute_1.default)(RELATIONS_1.RHP_TO_SETTINGS[route.name]);
        return (0, getInitialSplitNavigatorState_1.default)({
            name: SCREENS_1.default.SETTINGS.ROOT,
        }, {
            name: RELATIONS_1.RHP_TO_SETTINGS[route.name],
            params: paramsFromRoute.length > 0 ? (0, pick_1.default)(route.params, paramsFromRoute) : undefined,
        });
    }
    return undefined;
}
// If there is no particular matching route defined, we want to get the default route.
// It is the reports split navigator with report. If the reportID is defined in the focused route, we want to use it for the default report.
// This is separated from getMatchingFullScreenRoute because we want to use it only for the initial state.
// We don't want to make this route mandatory e.g. after deep linking or opening a specific flow.
function getDefaultFullScreenRoute(route) {
    // We will use it if the reportID is not defined. Router of this navigator has logic to fill it with a report.
    const fallbackRoute = {
        name: NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR,
    };
    if (route && isRouteWithReportID(route)) {
        const reportID = route.params.reportID;
        if (!allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`]?.reportID) {
            return fallbackRoute;
        }
        return (0, getInitialSplitNavigatorState_1.default)({
            name: SCREENS_1.default.HOME,
        }, {
            name: SCREENS_1.default.REPORT,
            params: { reportID },
        });
    }
    return fallbackRoute;
}
function getOnboardingAdaptedState(state) {
    const onboardingRoute = state.routes.at(0);
    if (!onboardingRoute || onboardingRoute.name === SCREENS_1.default.ONBOARDING.PURPOSE || onboardingRoute.name === SCREENS_1.default.ONBOARDING.WORK_EMAIL) {
        return state;
    }
    const routes = [];
    routes.push({ name: onboardingRoute.name === SCREENS_1.default.ONBOARDING.WORKSPACES ? SCREENS_1.default.ONBOARDING.PERSONAL_DETAILS : SCREENS_1.default.ONBOARDING.PURPOSE });
    if (onboardingRoute.name === SCREENS_1.default.ONBOARDING.ACCOUNTING) {
        routes.push({ name: SCREENS_1.default.ONBOARDING.EMPLOYEES });
    }
    routes.push(onboardingRoute);
    return getRoutesWithIndex(routes);
}
function getAdaptedState(state) {
    const fullScreenRoute = state.routes.find((route) => (0, isNavigatorName_1.isFullScreenName)(route.name));
    const onboardingNavigator = state.routes.find((route) => route.name === NAVIGATORS_1.default.ONBOARDING_MODAL_NAVIGATOR);
    const isWorkspaceSplitNavigator = fullScreenRoute?.name === NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR;
    if (isWorkspaceSplitNavigator) {
        const workspacesListRoute = { name: SCREENS_1.default.WORKSPACES_LIST };
        return getRoutesWithIndex([workspacesListRoute, ...state.routes]);
    }
    // If there is no full screen route in the root, we want to add it.
    if (!fullScreenRoute) {
        const focusedRoute = (0, native_1.findFocusedRoute)(state);
        if (focusedRoute) {
            const matchingRootRoute = getMatchingFullScreenRoute(focusedRoute);
            // If there is a matching root route, add it to the state.
            if (matchingRootRoute) {
                const routes = [matchingRootRoute, ...state.routes];
                if (matchingRootRoute.name === NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR) {
                    const workspacesListRoute = { name: SCREENS_1.default.WORKSPACES_LIST };
                    routes.unshift(workspacesListRoute);
                }
                return getRoutesWithIndex(routes);
            }
        }
        const defaultFullScreenRoute = getDefaultFullScreenRoute(focusedRoute);
        // The onboarding flow consists of several screens. If we open any of the screens, the previous screens from that flow should be in the state.
        if (onboardingNavigator?.state) {
            const adaptedOnboardingNavigator = {
                ...onboardingNavigator,
                state: getOnboardingAdaptedState(onboardingNavigator.state),
            };
            return getRoutesWithIndex([defaultFullScreenRoute, adaptedOnboardingNavigator]);
        }
        // If not, add the default full screen route.
        return getRoutesWithIndex([defaultFullScreenRoute, ...state.routes]);
    }
    return state;
}
/**
 * Generate a navigation state from a given path, adapting it to handle cases like onboarding flow,
 * displaying RHP screens and navigating in the Workspaces tab.
 * For detailed information about generating state from a path,
 * see the NAVIGATION.md documentation.
 *
 * @param path - The path to generate state from
 * @param options - Extra options to fine-tune how to parse the path
 * @param shouldReplacePathInNestedState - Whether to replace the path in nested state
 * @returns The adapted navigation state
 * @throws Error if unable to get state from path
 */
const getAdaptedStateFromPath = (path, options, shouldReplacePathInNestedState = true) => {
    let normalizedPath = !path.startsWith('/') ? `/${path}` : path;
    normalizedPath = (0, getMatchingNewRoute_1.default)(normalizedPath) ?? normalizedPath;
    // Bing search results still link to /signin when searching for “Expensify”, but the /signin route no longer exists in our repo, so we redirect it to the home page to avoid showing a Not Found page.
    if (normalizedPath === CONST_1.default.SIGNIN_ROUTE) {
        normalizedPath = '/';
    }
    const state = (0, native_1.getStateFromPath)(normalizedPath, options);
    if (shouldReplacePathInNestedState) {
        (0, replacePathInNestedState_1.default)(state, normalizedPath);
    }
    if (state === undefined) {
        throw new Error(`[getAdaptedStateFromPath] Unable to get state from path: ${path}`);
    }
    return getAdaptedState(state);
};
exports.default = getAdaptedStateFromPath;
