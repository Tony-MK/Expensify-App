"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigationRef = void 0;
const core_1 = require("@react-navigation/core");
const native_1 = require("@react-navigation/native");
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
const omit_1 = require("lodash/omit");
const react_native_1 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const getIsNarrowLayout_1 = require("@libs/getIsNarrowLayout");
const Log_1 = require("@libs/Log");
const ObjectUtils_1 = require("@libs/ObjectUtils");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SCREENS_1 = require("@src/SCREENS");
const getInitialSplitNavigatorState_1 = require("./AppNavigator/createSplitNavigator/getInitialSplitNavigatorState");
const closeRHPFlow_1 = require("./helpers/closeRHPFlow");
const getStateFromPath_1 = require("./helpers/getStateFromPath");
const getTopmostReportParams_1 = require("./helpers/getTopmostReportParams");
const isNavigatorName_1 = require("./helpers/isNavigatorName");
const isReportOpenInRHP_1 = require("./helpers/isReportOpenInRHP");
const isSideModalNavigator_1 = require("./helpers/isSideModalNavigator");
const linkTo_1 = require("./helpers/linkTo");
const getMinimalAction_1 = require("./helpers/linkTo/getMinimalAction");
const replaceWithSplitNavigator_1 = require("./helpers/replaceWithSplitNavigator");
const setNavigationActionToMicrotaskQueue_1 = require("./helpers/setNavigationActionToMicrotaskQueue");
const linkingConfig_1 = require("./linkingConfig");
const RELATIONS_1 = require("./linkingConfig/RELATIONS");
const navigationRef_1 = require("./navigationRef");
exports.navigationRef = navigationRef_1.default;
// Routes which are part of the flow to set up 2FA
const SET_UP_2FA_ROUTES = [
    ROUTES_1.default.REQUIRE_TWO_FACTOR_AUTH,
    ROUTES_1.default.SETTINGS_2FA_ROOT.getRoute(ROUTES_1.default.REQUIRE_TWO_FACTOR_AUTH),
    ROUTES_1.default.SETTINGS_2FA_VERIFY.getRoute(ROUTES_1.default.REQUIRE_TWO_FACTOR_AUTH),
    ROUTES_1.default.SETTINGS_2FA_SUCCESS.getRoute(ROUTES_1.default.REQUIRE_TWO_FACTOR_AUTH),
];
let account;
// We have used `connectWithoutView` here because it is not connected to any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.ACCOUNT,
    callback: (value) => {
        account = value;
    },
});
function shouldShowRequire2FAPage() {
    return !!account?.needsTwoFactorAuthSetup && !account?.requiresTwoFactorAuth;
}
let resolveNavigationIsReadyPromise;
const navigationIsReadyPromise = new Promise((resolve) => {
    resolveNavigationIsReadyPromise = resolve;
});
let pendingNavigationCall = null;
let shouldPopToSidebar = false;
/**
 * Inform the navigation that next time user presses UP we should pop all the state back to LHN.
 */
function setShouldPopToSidebar(shouldPopAllStateFlag) {
    shouldPopToSidebar = shouldPopAllStateFlag;
}
/**
 * Returns shouldPopToSidebar variable used to determine whether should we pop all state back to LHN
 * @returns shouldPopToSidebar
 */
function getShouldPopToSidebar() {
    return shouldPopToSidebar;
}
/**
 * Checks if the route can be navigated to based on whether the navigation ref is ready and if 2FA is required to be set up.
 */
function canNavigate(methodName, params = {}) {
    // Block navigation if 2FA is required and the targetRoute is not part of the flow to enable 2FA
    const targetRoute = params.route ?? params.backToRoute;
    if (shouldShowRequire2FAPage() && targetRoute && !SET_UP_2FA_ROUTES.includes(targetRoute)) {
        Log_1.default.info(`[Navigation] Blocked navigation because 2FA is required to be set up to access route: ${targetRoute}`);
        return false;
    }
    if (navigationRef_1.default.isReady()) {
        return true;
    }
    Log_1.default.hmmm(`[Navigation] ${methodName} failed because navigation ref was not yet ready`, params);
    return false;
}
/**
 * Extracts from the topmost report its id.
 */
const getTopmostReportId = (state = navigationRef_1.default.getState()) => (0, getTopmostReportParams_1.default)(state)?.reportID;
/**
 * Extracts from the topmost report its action id.
 */
const getTopmostReportActionId = (state = navigationRef_1.default.getState()) => (0, getTopmostReportParams_1.default)(state)?.reportActionID;
/**
 * Re-exporting the closeRHPFlow here to fill in default value for navigationRef. The closeRHPFlow isn't defined in this file to avoid cyclic dependencies.
 */
const closeRHPFlow = (ref = navigationRef_1.default) => (0, closeRHPFlow_1.default)(ref);
/**
 * Returns the current active route.
 */
function getActiveRoute() {
    const currentRoute = navigationRef_1.default.current && navigationRef_1.default.current.getCurrentRoute();
    if (!currentRoute?.name) {
        return '';
    }
    const routeFromState = (0, native_1.getPathFromState)(navigationRef_1.default.getRootState(), linkingConfig_1.linkingConfig.config);
    if (routeFromState) {
        return routeFromState;
    }
    return '';
}
/**
 * Returns the route of a report opened in RHP.
 */
function getReportRHPActiveRoute() {
    if ((0, isReportOpenInRHP_1.default)(navigationRef_1.default.getRootState())) {
        return getActiveRoute();
    }
    return '';
}
/**
 * Cleans the route path by removing redundant slashes and query parameters.
 * @param routePath The route path to clean.
 * @returns The cleaned route path.
 */
function cleanRoutePath(routePath) {
    return routePath.replace(CONST_1.default.REGEX.ROUTES.REDUNDANT_SLASHES, (match, p1) => (p1 ? '/' : '')).replace(/\?.*/, '');
}
/**
 * Check whether the passed route is currently Active or not.
 *
 * Building path with getPathFromState since navigationRef.current.getCurrentRoute().path
 * is undefined in the first navigation.
 *
 * @param routePath Path to check
 * @return is active
 */
function isActiveRoute(routePath) {
    let activeRoute = getActiveRouteWithoutParams();
    activeRoute = activeRoute.startsWith('/') ? activeRoute.substring(1) : activeRoute;
    // We remove redundant (consecutive and trailing) slashes from path before matching
    return cleanRoutePath(activeRoute) === cleanRoutePath(routePath);
}
/**
 * Navigates to a specified route.
 * Main navigation method for redirecting to a route.
 * For detailed information about moving between screens,
 * see the NAVIGATION.md documentation.
 *
 * @param route - The route to navigate to.
 * @param options - Optional navigation options.
 * @param options.forceReplace - If true, the navigation action will replace the current route instead of pushing a new one.
 */
function navigate(route, options) {
    if (!canNavigate('navigate', { route })) {
        if (!navigationRef_1.default.isReady()) {
            // Store intended route if the navigator is not yet available,
            // we will try again after the NavigationContainer is ready
            Log_1.default.hmmm(`[Navigation] Container not yet ready, storing route as pending: ${route}`);
            pendingNavigationCall = { route, options };
        }
        return;
    }
    (0, linkTo_1.default)(navigationRef_1.default.current, route, options);
}
/**
 * When routes are compared to determine whether the fallback route passed to the goUp function is in the state,
 * these parameters shouldn't be included in the comparison.
 */
const routeParamsIgnore = ['path', 'initial', 'params', 'state', 'screen', 'policyID', 'pop'];
/**
 * @private
 * If we use destructuring, we will get an error if any of the ignored properties are not present in the object.
 */
function getRouteParamsToCompare(routeParams) {
    return (0, omit_1.default)(routeParams, routeParamsIgnore);
}
/**
 * @private
 * Private method used in goUp to determine whether a target route is present in the navigation state.
 */
function doesRouteMatchToMinimalActionPayload(route, minimalAction, compareParams) {
    if (!minimalAction.payload) {
        return false;
    }
    if (!('name' in minimalAction.payload)) {
        return false;
    }
    const areRouteNamesEqual = route.name === minimalAction.payload.name;
    if (!areRouteNamesEqual) {
        return false;
    }
    if (!compareParams) {
        return true;
    }
    if (!('params' in minimalAction.payload)) {
        return false;
    }
    const routeParams = getRouteParamsToCompare(route.params);
    const minimalActionParams = getRouteParamsToCompare(minimalAction.payload.params);
    return (0, ObjectUtils_1.shallowCompare)(routeParams, minimalActionParams);
}
/**
 * @private
 * Checks whether the given state is the root navigator state
 */
function isRootNavigatorState(state) {
    return state.key === navigationRef_1.default.current?.getRootState().key;
}
const defaultGoBackOptions = {
    compareParams: true,
};
/**
 * @private
 * Navigate to the given backToRoute taking into account whether it is possible to go back to this screen. Within one nested navigator, we can go back by any number
 * of screens, but if as a result of going back we would have to remove more than one screen from the rootState,
 * replace is performed so as not to lose the visited pages.
 * If backToRoute is not found in the state, replace is also called then.
 *
 * @param backToRoute - The route to go up.
 * @param options - Optional configuration that affects navigation logic, such as parameter comparison.
 */
function goUp(backToRoute, options) {
    if (!canNavigate('goUp', { backToRoute }) || !navigationRef_1.default.current) {
        Log_1.default.hmmm(`[Navigation] Unable to go up. Can't navigate.`);
        return;
    }
    const compareParams = options?.compareParams ?? defaultGoBackOptions.compareParams;
    const rootState = navigationRef_1.default.current.getRootState();
    const stateFromPath = (0, getStateFromPath_1.default)(backToRoute);
    const action = (0, core_1.getActionFromState)(stateFromPath, linkingConfig_1.linkingConfig.config);
    if (!action) {
        Log_1.default.hmmm(`[Navigation] Unable to go up. Action is undefined.`);
        return;
    }
    const { action: minimalAction, targetState } = (0, getMinimalAction_1.default)(action, rootState);
    if (minimalAction.type !== CONST_1.default.NAVIGATION.ACTION_TYPE.NAVIGATE || !targetState) {
        Log_1.default.hmmm('[Navigation] Unable to go up. Minimal action type is wrong.');
        return;
    }
    const indexOfBackToRoute = targetState.routes.findLastIndex((route) => doesRouteMatchToMinimalActionPayload(route, minimalAction, compareParams));
    const distanceToPop = targetState.routes.length - indexOfBackToRoute - 1;
    // If we need to pop more than one route from rootState, we replace the current route to not lose visited routes from the navigation state
    if (indexOfBackToRoute === -1 || (isRootNavigatorState(targetState) && distanceToPop > 1)) {
        const replaceAction = { ...minimalAction, type: CONST_1.default.NAVIGATION.ACTION_TYPE.REPLACE };
        navigationRef_1.default.current.dispatch(replaceAction);
        return;
    }
    /**
     * If we are not comparing params, we want to use popTo action because it will replace params in the route already existing in the state if necessary.
     */
    if (!compareParams) {
        navigationRef_1.default.current.dispatch({ ...minimalAction, type: CONST_1.default.NAVIGATION.ACTION_TYPE.POP_TO });
        return;
    }
    navigationRef_1.default.current.dispatch({ ...native_1.StackActions.pop(distanceToPop), target: targetState.key });
}
/**
 * Navigate back to the previous screen or a specified route.
 * For detailed information about navigation patterns and best practices,
 * see the NAVIGATION.md documentation.
 * @param backToRoute - Fallback route if pop/goBack action should, but is not possible within RHP
 * @param options - Optional configuration that affects navigation logic
 */
function goBack(backToRoute, options) {
    if (!canNavigate('goBack', { backToRoute })) {
        return;
    }
    if (backToRoute) {
        goUp(backToRoute, options);
        return;
    }
    if (!navigationRef_1.default.current?.canGoBack()) {
        Log_1.default.hmmm('[Navigation] Unable to go back');
        return;
    }
    navigationRef_1.default.current?.goBack();
}
/**
 * Navigate back to the sidebar screen in SplitNavigator and pop all central screens from the navigator at the same time.
 * For detailed information about moving between screens,
 * see the NAVIGATION.md documentation.
 */
function popToSidebar() {
    setShouldPopToSidebar(false);
    const rootState = navigationRef_1.default.current?.getRootState();
    const currentRoute = rootState?.routes.at(-1);
    if (!currentRoute) {
        Log_1.default.hmmm('[popToSidebar] Unable to pop to sidebar, no current root found in navigator');
        return;
    }
    if (!(0, isNavigatorName_1.isSplitNavigatorName)(currentRoute?.name)) {
        Log_1.default.hmmm('[popToSidebar] must be invoked only from SplitNavigator');
        return;
    }
    const topRoute = currentRoute.state?.routes.at(0);
    const lastRoute = currentRoute.state?.routes.at(-1);
    const currentRouteName = currentRoute?.name;
    if (topRoute?.name !== RELATIONS_1.SPLIT_TO_SIDEBAR[currentRouteName]) {
        const params = currentRoute.name === NAVIGATORS_1.default.WORKSPACE_SPLIT_NAVIGATOR ? { ...lastRoute?.params } : undefined;
        const sidebarName = RELATIONS_1.SPLIT_TO_SIDEBAR[currentRouteName];
        navigationRef_1.default.dispatch({ payload: { name: sidebarName, params }, type: CONST_1.default.NAVIGATION.ACTION_TYPE.REPLACE });
        return;
    }
    navigationRef_1.default.current?.dispatch(native_1.StackActions.popToTop());
}
/**
 * Reset the navigation state to Home page.
 */
function resetToHome() {
    const isNarrowLayout = (0, getIsNarrowLayout_1.default)();
    const rootState = navigationRef_1.default.getRootState();
    navigationRef_1.default.dispatch({ ...native_1.StackActions.popToTop(), target: rootState.key });
    const splitNavigatorMainScreen = !isNarrowLayout
        ? {
            name: SCREENS_1.default.REPORT,
        }
        : undefined;
    const payload = (0, getInitialSplitNavigatorState_1.default)({ name: SCREENS_1.default.HOME }, splitNavigatorMainScreen);
    navigationRef_1.default.dispatch({ payload, type: CONST_1.default.NAVIGATION.ACTION_TYPE.REPLACE, target: rootState.key });
}
/**
 * The goBack function doesn't support recursive pop e.g. pop route from root and then from nested navigator.
 * There is only one case where recursive pop is needed which is going back to home.
 * This function will cover this case.
 * We will implement recursive pop if more use cases will appear.
 */
function goBackToHome() {
    const isNarrowLayout = (0, getIsNarrowLayout_1.default)();
    // This set the right split navigator.
    goBack(ROUTES_1.default.HOME);
    // We want to keep the report screen in the split navigator on wide layout.
    if (!isNarrowLayout) {
        return;
    }
    // This set the right route in this split navigator.
    goBack(ROUTES_1.default.HOME);
}
/**
 * Update route params for the specified route.
 */
function setParams(params, routeKey = '') {
    navigationRef_1.default.current?.dispatch({
        ...native_1.CommonActions.setParams(params),
        source: routeKey,
    });
}
/**
 * Returns the current active route without the URL params.
 */
function getActiveRouteWithoutParams() {
    return getActiveRoute().replace(/\?.*/, '');
}
/**
 * Returns the active route name from a state event from the navigationRef.
 */
function getRouteNameFromStateEvent(event) {
    if (!event.data.state) {
        return;
    }
    const currentRouteName = event.data.state.routes.at(-1)?.name;
    // Check to make sure we have a route name
    if (currentRouteName) {
        return currentRouteName;
    }
}
/**
 * @private
 * Navigate to the route that we originally intended to go to
 * but the NavigationContainer was not ready when navigate() was called
 */
function goToPendingRoute() {
    if (pendingNavigationCall === null) {
        return;
    }
    Log_1.default.hmmm(`[Navigation] Container now ready, going to pending route: ${pendingNavigationCall.route}`);
    navigate(pendingNavigationCall.route, pendingNavigationCall.options);
    pendingNavigationCall = null;
}
function isNavigationReady() {
    return navigationIsReadyPromise;
}
function setIsNavigationReady() {
    goToPendingRoute();
    resolveNavigationIsReadyPromise();
}
/**
 * @private
 * Checks if the navigation state contains routes that are protected (over the auth wall).
 *
 * @param state - react-navigation state object
 */
function navContainsProtectedRoutes(state) {
    if (!state?.routeNames || !Array.isArray(state.routeNames)) {
        return false;
    }
    // If one protected screen is in the routeNames then other screens are there as well.
    return state?.routeNames.includes(SCREENS_1.PROTECTED_SCREENS.CONCIERGE);
}
/**
 * Waits for the navigation state to contain protected routes specified in PROTECTED_SCREENS constant.
 * If the navigation is in a state, where protected routes are available, the promise resolve immediately.
 *
 * @function
 * @returns A promise that resolves when the one of the PROTECTED_SCREENS screen is available in the nav tree.
 *
 * @example
 * waitForProtectedRoutes()
 *     .then(()=> console.log('Protected routes are present!'))
 */
function waitForProtectedRoutes() {
    return new Promise((resolve) => {
        isNavigationReady().then(() => {
            const currentState = navigationRef_1.default.current?.getState();
            if (navContainsProtectedRoutes(currentState)) {
                resolve();
                return;
            }
            const unsubscribe = navigationRef_1.default.current?.addListener('state', ({ data }) => {
                const state = data?.state;
                if (navContainsProtectedRoutes(state)) {
                    unsubscribe?.();
                    resolve();
                }
            });
        });
    });
}
function getReportRouteByID(reportID, routes = navigationRef_1.default.getRootState().routes) {
    if (!reportID || !routes?.length) {
        return null;
    }
    for (const route of routes) {
        if (route.name === SCREENS_1.default.REPORT && !!route.params && 'reportID' in route.params && route.params.reportID === reportID) {
            return route;
        }
        if (route.state?.routes) {
            const partialRoute = getReportRouteByID(reportID, route.state.routes);
            if (partialRoute) {
                return partialRoute;
            }
        }
    }
    return null;
}
/**
 * Closes the modal navigator (RHP, onboarding).
 * For detailed information about dismissing modals,
 * see the NAVIGATION.md documentation.
 */
const dismissModal = (ref = navigationRef_1.default) => {
    isNavigationReady().then(() => {
        ref.dispatch({ type: CONST_1.default.NAVIGATION.ACTION_TYPE.DISMISS_MODAL });
        // Let React Navigation finish modal transition
        react_native_1.InteractionManager.runAfterInteractions(() => {
            fireModalDismissed();
        });
    });
};
/**
 * Dismisses the modal and opens the given report.
 * For detailed information about dismissing modals,
 * see the NAVIGATION.md documentation.
 */
const dismissModalWithReport = ({ reportID, reportActionID, referrer, backTo }, ref = navigationRef_1.default) => {
    isNavigationReady().then(() => {
        const topmostReportID = getTopmostReportId();
        const areReportsIDsDefined = !!topmostReportID && !!reportID;
        const isReportsSplitTopmostFullScreen = ref.getRootState().routes.findLast((route) => (0, isNavigatorName_1.isFullScreenName)(route.name))?.name === NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR;
        if (topmostReportID === reportID && areReportsIDsDefined && isReportsSplitTopmostFullScreen) {
            dismissModal();
            return;
        }
        const reportRoute = ROUTES_1.default.REPORT_WITH_ID.getRoute(reportID, reportActionID, referrer, backTo);
        if ((0, getIsNarrowLayout_1.default)()) {
            navigate(reportRoute, { forceReplace: true });
            return;
        }
        dismissModal();
        react_native_1.InteractionManager.runAfterInteractions(() => {
            navigate(reportRoute);
        });
    });
};
/**
 * Returns to the first screen in the stack, dismissing all the others, only if the global variable shouldPopToSidebar is set to true.
 */
function popToTop() {
    if (!shouldPopToSidebar) {
        goBack();
        return;
    }
    shouldPopToSidebar = false;
    navigationRef_1.default.current?.dispatch(native_1.StackActions.popToTop());
}
function popRootToTop() {
    const rootState = navigationRef_1.default.getRootState();
    navigationRef_1.default.current?.dispatch({ ...native_1.StackActions.popToTop(), target: rootState.key });
}
function pop(target) {
    navigationRef_1.default.current?.dispatch({ ...native_1.StackActions.pop(), target });
}
function removeScreenFromNavigationState(screen) {
    isNavigationReady().then(() => {
        navigationRef_1.default.current?.dispatch((state) => {
            const routes = state.routes?.filter((item) => item.name !== screen);
            return native_1.CommonActions.reset({
                ...state,
                routes,
                index: routes.length < state.routes.length ? state.index - 1 : state.index,
            });
        });
    });
}
function isTopmostRouteModalScreen() {
    const topmostRouteName = navigationRef_1.default.getRootState()?.routes?.at(-1)?.name;
    return (0, isSideModalNavigator_1.default)(topmostRouteName);
}
function removeScreenByKey(key) {
    isNavigationReady().then(() => {
        navigationRef_1.default.current?.dispatch((state) => {
            const routes = state.routes?.filter((item) => item.key !== key);
            return native_1.CommonActions.reset({
                ...state,
                routes,
                index: routes.length < state.routes.length ? state.index - 1 : state.index,
            });
        });
    });
}
function isOnboardingFlow() {
    const state = navigationRef_1.default.getRootState();
    const currentFocusedRoute = (0, core_1.findFocusedRoute)(state);
    return (0, isNavigatorName_1.isOnboardingFlowName)(currentFocusedRoute?.name);
}
function clearPreloadedRoutes() {
    const rootStateWithoutPreloadedRoutes = { ...navigationRef_1.default.getRootState(), preloadedRoutes: [] };
    navigationRef_1.default.reset(rootStateWithoutPreloadedRoutes);
}
const modalDismissedListeners = [];
function onModalDismissedOnce(callback) {
    modalDismissedListeners.push(callback);
}
// Wrap modal dismissal so listeners get called
function fireModalDismissed() {
    while (modalDismissedListeners.length) {
        const cb = modalDismissedListeners.pop();
        cb?.();
    }
}
exports.default = {
    setShouldPopToSidebar,
    getShouldPopToSidebar,
    popToSidebar,
    navigate,
    setParams,
    dismissModal,
    dismissModalWithReport,
    isActiveRoute,
    getActiveRoute,
    getActiveRouteWithoutParams,
    getReportRHPActiveRoute,
    goBack,
    isNavigationReady,
    setIsNavigationReady,
    getTopmostReportId,
    getRouteNameFromStateEvent,
    getTopmostReportActionId,
    waitForProtectedRoutes,
    resetToHome,
    goBackToHome,
    closeRHPFlow,
    setNavigationActionToMicrotaskQueue: setNavigationActionToMicrotaskQueue_1.default,
    popToTop,
    popRootToTop,
    pop,
    removeScreenFromNavigationState,
    removeScreenByKey,
    getReportRouteByID,
    replaceWithSplitNavigator: replaceWithSplitNavigator_1.default,
    isTopmostRouteModalScreen,
    isOnboardingFlow,
    clearPreloadedRoutes,
    onModalDismissedOnce,
    fireModalDismissed,
};
