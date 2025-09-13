"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_1 = require("@react-navigation/native");
const react_1 = require("react");
const ScrollOffsetContextProvider_1 = require("@components/ScrollOffsetContextProvider");
const useCurrentReportID_1 = require("@hooks/useCurrentReportID");
const useOnyx_1 = require("@hooks/useOnyx");
const usePrevious_1 = require("@hooks/usePrevious");
const useResponsiveLayout_1 = require("@hooks/useResponsiveLayout");
const useThemePreference_1 = require("@hooks/useThemePreference");
const Firebase_1 = require("@libs/Firebase");
const Fullstory_1 = require("@libs/Fullstory");
const Log_1 = require("@libs/Log");
const onboardingSelectors_1 = require("@libs/onboardingSelectors");
const shouldOpenLastVisitedPath_1 = require("@libs/shouldOpenLastVisitedPath");
const Url_1 = require("@libs/Url");
const App_1 = require("@userActions/App");
const Welcome_1 = require("@userActions/Welcome");
const OnboardingFlow_1 = require("@userActions/Welcome/OnboardingFlow");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const AppNavigator_1 = require("./AppNavigator");
const usePreserveNavigatorState_1 = require("./AppNavigator/createSplitNavigator/usePreserveNavigatorState");
const getAdaptedStateFromPath_1 = require("./helpers/getAdaptedStateFromPath");
const isNavigatorName_1 = require("./helpers/isNavigatorName");
const lastVisitedTabPathUtils_1 = require("./helpers/lastVisitedTabPathUtils");
const linkingConfig_1 = require("./linkingConfig");
const Navigation_1 = require("./Navigation");
/**
 * Intercept navigation state changes and log it
 */
function parseAndLogRoute(state) {
    if (!state) {
        return;
    }
    const currentPath = (0, native_1.getPathFromState)(state, linkingConfig_1.linkingConfig.config);
    const focusedRoute = (0, native_1.findFocusedRoute)(state);
    if (focusedRoute && !CONST_1.default.EXCLUDE_FROM_LAST_VISITED_PATH.includes(focusedRoute?.name)) {
        (0, App_1.updateLastVisitedPath)(currentPath);
        if (currentPath.startsWith(`/${ROUTES_1.default.ONBOARDING_ROOT.route}`)) {
            (0, Welcome_1.updateOnboardingLastVisitedPath)(currentPath);
        }
    }
    // Don't log the route transitions from OldDot because they contain authTokens
    if (currentPath.includes('/transition')) {
        Log_1.default.info('Navigating from transition link from OldDot using short lived authToken');
    }
    else {
        Log_1.default.info('Navigating to route', false, { path: currentPath });
    }
    Navigation_1.default.setIsNavigationReady();
    if ((0, isNavigatorName_1.isWorkspacesTabScreenName)(state.routes.at(-1)?.name)) {
        (0, lastVisitedTabPathUtils_1.saveWorkspacesTabPathToSessionStorage)(currentPath);
    }
    else if (state.routes.at(-1)?.name === NAVIGATORS_1.default.SETTINGS_SPLIT_NAVIGATOR) {
        (0, lastVisitedTabPathUtils_1.saveSettingsTabPathToSessionStorage)(currentPath);
    }
    // Fullstory Page navigation tracking
    const focusedRouteName = focusedRoute?.name;
    if (focusedRouteName) {
        new Fullstory_1.default.Page(focusedRouteName, { path: currentPath }).start();
    }
}
function NavigationRoot({ authenticated, lastVisitedPath, initialUrl, onReady }) {
    const firstRenderRef = (0, react_1.useRef)(true);
    const themePreference = (0, useThemePreference_1.default)();
    const { cleanStaleScrollOffsets } = (0, react_1.useContext)(ScrollOffsetContextProvider_1.ScrollOffsetContext);
    const currentReportIDValue = (0, useCurrentReportID_1.default)();
    const { shouldUseNarrowLayout } = (0, useResponsiveLayout_1.default)();
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    const [isOnboardingCompleted = true] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_ONBOARDING, {
        selector: onboardingSelectors_1.hasCompletedGuidedSetupFlowSelector,
        canBeMissing: true,
    });
    const [wasInvitedToNewDot = false] = (0, useOnyx_1.default)(ONYXKEYS_1.default.NVP_INTRO_SELECTED, {
        selector: onboardingSelectors_1.wasInvitedToNewDotSelector,
        canBeMissing: true,
    });
    const [hasNonPersonalPolicy] = (0, useOnyx_1.default)(ONYXKEYS_1.default.HAS_NON_PERSONAL_POLICY, { canBeMissing: true });
    const [currentOnboardingPurposeSelected] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_PURPOSE_SELECTED, { canBeMissing: true });
    const [currentOnboardingCompanySize] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_COMPANY_SIZE, { canBeMissing: true });
    const [onboardingInitialPath] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ONBOARDING_LAST_VISITED_PATH, { canBeMissing: true });
    const previousAuthenticated = (0, usePrevious_1.default)(authenticated);
    const initialState = (0, react_1.useMemo)(() => {
        const path = initialUrl ? (0, Url_1.getPathFromURL)(initialUrl) : null;
        if (path?.includes(ROUTES_1.default.MIGRATED_USER_WELCOME_MODAL.route) && (0, shouldOpenLastVisitedPath_1.default)(lastVisitedPath) && isOnboardingCompleted && authenticated) {
            Navigation_1.default.isNavigationReady().then(() => {
                Navigation_1.default.navigate(ROUTES_1.default.MIGRATED_USER_WELCOME_MODAL.getRoute());
            });
            return (0, getAdaptedStateFromPath_1.default)(lastVisitedPath, linkingConfig_1.linkingConfig.config);
        }
        if (!account || account.isFromPublicDomain) {
            return;
        }
        const shouldShowRequire2FAPage = !!account?.needsTwoFactorAuthSetup && !account.requiresTwoFactorAuth;
        if (shouldShowRequire2FAPage) {
            return (0, getAdaptedStateFromPath_1.default)(ROUTES_1.default.REQUIRE_TWO_FACTOR_AUTH, linkingConfig_1.linkingConfig.config);
        }
        const isTransitioning = path?.includes(ROUTES_1.default.TRANSITION_BETWEEN_APPS);
        // If the user haven't completed the flow, we want to always redirect them to the onboarding flow.
        // We also make sure that the user is authenticated, isn't part of a group workspace, isn't in the transition flow & wasn't invited to NewDot.
        if (!CONFIG_1.default.IS_HYBRID_APP && !hasNonPersonalPolicy && !isOnboardingCompleted && !wasInvitedToNewDot && authenticated && !isTransitioning) {
            return (0, getAdaptedStateFromPath_1.default)((0, OnboardingFlow_1.getOnboardingInitialPath)({
                isUserFromPublicDomain: !!account.isFromPublicDomain,
                hasAccessiblePolicies: !!account.hasAccessibleDomainPolicies,
                currentOnboardingPurposeSelected,
                currentOnboardingCompanySize,
                onboardingInitialPath,
            }), linkingConfig_1.linkingConfig.config);
        }
        // If there is no lastVisitedPath, we can do early return. We won't modify the default behavior.
        // The same applies to HybridApp, as we always define the route to which we want to transition.
        if (!(0, shouldOpenLastVisitedPath_1.default)(lastVisitedPath) || CONFIG_1.default.IS_HYBRID_APP) {
            return undefined;
        }
        // If the user opens the root of app "/" it will be parsed to empty string "".
        // If the path is defined and different that empty string we don't want to modify the default behavior.
        if (path) {
            return;
        }
        // Otherwise we want to redirect the user to the last visited path.
        return (0, getAdaptedStateFromPath_1.default)(lastVisitedPath, linkingConfig_1.linkingConfig.config);
        // The initialState value is relevant only on the first render.
        // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps
    }, []);
    // https://reactnavigation.org/docs/themes
    const navigationTheme = (0, react_1.useMemo)(() => {
        const defaultNavigationTheme = themePreference === CONST_1.default.THEME.DARK ? native_1.DarkTheme : native_1.DefaultTheme;
        return {
            ...defaultNavigationTheme,
            colors: {
                ...defaultNavigationTheme.colors,
                /**
                 * We want to have a stack with variable size of screens in RHP.
                 * The stack is the size of the biggest screen in RHP. Screens that should be smaller will reduce it's size with margin.
                 * The stack have to be this size because it have a container with overflow: hidden.
                 * background: transparent is used to make bottom of the card stack transparent.
                 * To make sure that everything is correct, we will use theme.appBG in the screen wrapper.
                 */
                background: 'transparent',
            },
        };
    }, [themePreference]);
    (0, react_1.useEffect)(() => {
        if (firstRenderRef.current) {
            // we don't want to make the report back button go back to LHN if the user
            // started on the small screen so we don't set it on the first render
            // making it only work on consecutive changes of the screen size
            firstRenderRef.current = false;
            return;
        }
        // After resizing the screen from wide to narrow, if we have visited multiple central screens, we want to go back to the LHN screen, so we set shouldPopToSidebar to true.
        // Now when this value is true, Navigation.goBack with the option {shouldPopToTop: true} will remove all visited central screens in the given tab from the navigation stack and go back to the LHN.
        // More context here: https://github.com/Expensify/App/pull/59300
        if (!shouldUseNarrowLayout) {
            return;
        }
        Navigation_1.default.setShouldPopToSidebar(true);
    }, [shouldUseNarrowLayout]);
    (0, react_1.useEffect)(() => {
        // Since the NAVIGATORS.REPORTS_SPLIT_NAVIGATOR url is "/" and it has to be used as an URL for SignInPage,
        // this navigator should be the only one in the navigation state after logout.
        const hasUserLoggedOut = !authenticated && !!previousAuthenticated;
        if (!hasUserLoggedOut || !Navigation_1.navigationRef.isReady()) {
            return;
        }
        const rootState = Navigation_1.navigationRef.getRootState();
        const lastRoute = rootState.routes.at(-1);
        if (!lastRoute) {
            return;
        }
        // REPORTS_SPLIT_NAVIGATOR will persist after user logout, because it is used both for logged-in and logged-out users
        // That's why for ReportsSplit we need to explicitly clear params when resetting navigation state,
        // However in case other routes (related to login/logout) appear in nav state, then we want to preserve params for those
        const isReportSplitNavigatorMounted = lastRoute.name === NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR;
        Navigation_1.navigationRef.reset({
            ...rootState,
            index: 0,
            routes: [
                {
                    ...lastRoute,
                    params: isReportSplitNavigatorMounted ? undefined : lastRoute.params,
                },
            ],
        });
    }, [authenticated, previousAuthenticated]);
    const handleStateChange = (state) => {
        if (!state) {
            return;
        }
        const currentRoute = Navigation_1.navigationRef.getCurrentRoute();
        Firebase_1.default.log(`[NAVIGATION] screen: ${currentRoute?.name}, params: ${JSON.stringify(currentRoute?.params ?? {})}`);
        // Performance optimization to avoid context consumers to delay first render
        setTimeout(() => {
            currentReportIDValue?.updateCurrentReportID(state);
        }, 0);
        parseAndLogRoute(state);
        // We want to clean saved scroll offsets for screens that aren't anymore in the state.
        cleanStaleScrollOffsets(state);
        (0, usePreserveNavigatorState_1.cleanPreservedNavigatorStates)(state);
    };
    return (<native_1.NavigationContainer initialState={initialState} onStateChange={handleStateChange} onReady={onReady} theme={navigationTheme} ref={Navigation_1.navigationRef} linking={linkingConfig_1.linkingConfig} documentTitle={{
            enabled: false,
        }}>
            <AppNavigator_1.default authenticated={authenticated}/>
        </native_1.NavigationContainer>);
}
NavigationRoot.displayName = 'NavigationRoot';
exports.default = NavigationRoot;
