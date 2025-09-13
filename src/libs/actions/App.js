"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEYS_TO_PRESERVE = void 0;
exports.setLocale = setLocale;
exports.setSidebarLoaded = setSidebarLoaded;
exports.setUpPoliciesAndNavigate = setUpPoliciesAndNavigate;
exports.redirectThirdPartyDesktopSignIn = redirectThirdPartyDesktopSignIn;
exports.openApp = openApp;
exports.setAppLoading = setAppLoading;
exports.reconnectApp = reconnectApp;
exports.confirmReadyToOpenApp = confirmReadyToOpenApp;
exports.handleRestrictedEvent = handleRestrictedEvent;
exports.beginDeepLinkRedirect = beginDeepLinkRedirect;
exports.beginDeepLinkRedirectAfterTransition = beginDeepLinkRedirectAfterTransition;
exports.getMissingOnyxUpdates = getMissingOnyxUpdates;
exports.finalReconnectAppAfterActivatingReliableUpdates = finalReconnectAppAfterActivatingReliableUpdates;
exports.savePolicyDraftByNewWorkspace = savePolicyDraftByNewWorkspace;
exports.createWorkspaceWithPolicyDraftAndNavigateToIt = createWorkspaceWithPolicyDraftAndNavigateToIt;
exports.updateLastVisitedPath = updateLastVisitedPath;
exports.updateLastRoute = updateLastRoute;
exports.setIsUsingImportedState = setIsUsingImportedState;
exports.clearOnyxAndResetApp = clearOnyxAndResetApp;
exports.setPreservedUserSession = setPreservedUserSession;
// Issue - https://github.com/Expensify/App/issues/26719
const expensify_common_1 = require("expensify-common");
const react_native_1 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const Browser = require("@libs/Browser");
const DateUtils_1 = require("@libs/DateUtils");
const Log_1 = require("@libs/Log");
const currentUrl_1 = require("@libs/Navigation/currentUrl");
const Navigation_1 = require("@libs/Navigation/Navigation");
const Performance_1 = require("@libs/Performance");
const ReportUtils_1 = require("@libs/ReportUtils");
const SessionUtils_1 = require("@libs/SessionUtils");
const Sound_1 = require("@libs/Sound");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const Network_1 = require("./Network");
const PersistedRequests_1 = require("./PersistedRequests");
const Policy_1 = require("./Policy/Policy");
const Session_1 = require("./Session");
// `currentSessionData` is only used in actions, not during render. So `Onyx.connectWithoutView` is appropriate.
// If React components need this value in the future, use `useOnyx` instead.
let currentSessionData = {
    accountID: undefined,
    email: '',
};
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.SESSION,
    callback: (val) => {
        currentSessionData = {
            accountID: val?.accountID,
            email: val?.email ?? '',
        };
    },
});
// `isSidebarLoaded` is only used inside the event handler, not during render.
// `useOnyx` would trigger extra rerenders without affecting the View, so `Onyx.connectWithoutView` is used instead
let isSidebarLoaded;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.IS_SIDEBAR_LOADED,
    callback: (val) => (isSidebarLoaded = val),
    initWithStoredValues: false,
});
// `isUsingImportedState` is only used in `clearOnyxAndResetApp`, not during render. So `Onyx.connectWithoutView` is appropriate.
// If React components need this value in the future, use `useOnyx` instead.
let isUsingImportedState;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.IS_USING_IMPORTED_STATE,
    callback: (value) => {
        isUsingImportedState = value ?? false;
    },
});
// hasLoadedAppPromise is used in the "reconnectApp" function and is not directly associated with the View,
// so retrieving it using Onyx.connectWithoutView is correct.
let resolveHasLoadedAppPromise;
const hasLoadedAppPromise = new Promise((resolve) => {
    resolveHasLoadedAppPromise = resolve;
});
// hasLoadedApp is used in the "reconnectApp" function and is not directly associated with the View,
// so retrieving it using Onyx.connectWithoutView is correct.
// If this variable is ever needed for use in React components, it should be retrieved using useOnyx.
let hasLoadedApp;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.HAS_LOADED_APP,
    callback: (value) => {
        hasLoadedApp = value;
        resolveHasLoadedAppPromise?.();
    },
});
// allReports is used in the "ForOpenOrReconnect" functions and is not directly associated with the View,
// so retrieving it using Onyx.connectWithoutView is correct.
// If this variable is ever needed for use in React components, it should be retrieved using useOnyx.
let allReports;
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.COLLECTION.REPORT,
    waitForCollectionCallback: true,
    callback: (value) => {
        allReports = value;
    },
});
let preservedUserSession;
// We called `connectWithoutView` here because it is not connected to any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.PRESERVED_USER_SESSION,
    callback: (value) => {
        preservedUserSession = value;
    },
});
const KEYS_TO_PRESERVE = [
    ONYXKEYS_1.default.ACCOUNT,
    ONYXKEYS_1.default.IS_CHECKING_PUBLIC_ROOM,
    ONYXKEYS_1.default.IS_LOADING_APP,
    ONYXKEYS_1.default.IS_SIDEBAR_LOADED,
    ONYXKEYS_1.default.MODAL,
    ONYXKEYS_1.default.NETWORK,
    ONYXKEYS_1.default.SESSION,
    ONYXKEYS_1.default.SHOULD_SHOW_COMPOSE_INPUT,
    ONYXKEYS_1.default.NVP_TRY_FOCUS_MODE,
    ONYXKEYS_1.default.PREFERRED_THEME,
    ONYXKEYS_1.default.NVP_PREFERRED_LOCALE,
    ONYXKEYS_1.default.CREDENTIALS,
    ONYXKEYS_1.default.PRESERVED_USER_SESSION,
    ONYXKEYS_1.default.HYBRID_APP,
    ONYXKEYS_1.default.SHOULD_USE_STAGING_SERVER,
    ONYXKEYS_1.default.IS_DEBUG_MODE_ENABLED,
];
exports.KEYS_TO_PRESERVE = KEYS_TO_PRESERVE;
/*
 * This listener allows you to reset the state stored in Onyx by changing the value under the ONYXKEYS.RESET_REQUIRED key.
 * It is only used in emergencies when the entire state requires clearing.
 *
 * It has no direct impact on the View, making the use of Onyx.connectWithoutView justified in this case.
 */
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.RESET_REQUIRED,
    callback: (isResetRequired) => {
        if (!isResetRequired) {
            return;
        }
        react_native_onyx_1.default.clear(KEYS_TO_PRESERVE).then(() => {
            // Set this to false to reset the flag for this client
            react_native_onyx_1.default.set(ONYXKEYS_1.default.RESET_REQUIRED, false);
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            openApp();
        });
    },
});
let resolveIsReadyPromise;
const isReadyToOpenApp = new Promise((resolve) => {
    resolveIsReadyPromise = resolve;
});
function confirmReadyToOpenApp() {
    resolveIsReadyPromise();
}
function getNonOptimisticPolicyIDs(policies) {
    return Object.values(policies ?? {})
        .filter((policy) => policy && policy.pendingAction !== CONST_1.default.RED_BRICK_ROAD_PENDING_ACTION.ADD)
        .map((policy) => policy?.id)
        .filter((id) => !!id);
}
function setLocale(locale, currentPreferredLocale) {
    if (locale === currentPreferredLocale) {
        return;
    }
    // If user is not signed in, change just locally.
    if (!currentSessionData.accountID) {
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE, locale);
        return;
    }
    // Optimistically change preferred locale
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_PREFERRED_LOCALE,
            value: locale,
        },
    ];
    const parameters = {
        value: locale,
    };
    API.write(types_1.WRITE_COMMANDS.UPDATE_PREFERRED_LOCALE, parameters, { optimisticData });
}
function setSidebarLoaded() {
    if (isSidebarLoaded) {
        return;
    }
    react_native_onyx_1.default.set(ONYXKEYS_1.default.IS_SIDEBAR_LOADED, true);
    Performance_1.default.markEnd(CONST_1.default.TIMING.SIDEBAR_LOADED);
}
function setAppLoading(isLoading) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.IS_LOADING_APP, isLoading);
}
let appState;
react_native_1.AppState.addEventListener('change', (nextAppState) => {
    if (nextAppState.match(/inactive|background/) && appState === 'active') {
        Log_1.default.info('Flushing logs as app is going inactive', true, {}, true);
    }
    appState = nextAppState;
});
/**
 * Gets the policy params that are passed to the server in the OpenApp and ReconnectApp API commands. This includes a full list of policy IDs the client knows about as well as when they were last modified.
 */
function getPolicyParamsForOpenOrReconnect() {
    return new Promise((resolve) => {
        isReadyToOpenApp.then(() => {
            const connection = react_native_onyx_1.default.connect({
                key: ONYXKEYS_1.default.COLLECTION.POLICY,
                waitForCollectionCallback: true,
                callback: (policies) => {
                    react_native_onyx_1.default.disconnect(connection);
                    resolve({ policyIDList: getNonOptimisticPolicyIDs(policies) });
                },
            });
        });
    });
}
/**
 * Returns the Onyx data that is used for both the OpenApp and ReconnectApp API commands.
 */
function getOnyxDataForOpenOrReconnect(isOpenApp = false, isFullReconnect = false, shouldKeepPublicRooms = false, allReportsWithDraftComments) {
    const result = {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.IS_LOADING_REPORT_DATA,
                value: true,
            },
        ],
        successData: [],
        finallyData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.IS_LOADING_REPORT_DATA,
                value: false,
            },
        ],
        queueFlushedData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.HAS_LOADED_APP,
                value: true,
            },
        ],
    };
    if (isOpenApp) {
        result.optimisticData?.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.IS_LOADING_APP,
            value: true,
        });
        result.finallyData?.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.IS_LOADING_APP,
            value: false,
        });
    }
    if (isOpenApp || isFullReconnect) {
        result.successData?.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.LAST_FULL_RECONNECT_TIME,
            value: DateUtils_1.default.getDBTime(),
        });
    }
    if (shouldKeepPublicRooms) {
        const publicReports = Object.values(allReports ?? {}).filter((report) => (0, ReportUtils_1.isPublicRoom)(report) && (0, ReportUtils_1.isValidReport)(report));
        publicReports?.forEach((report) => {
            result.successData?.push({
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.reportID}`,
                value: {
                    ...report,
                },
            });
        });
    }
    // Find all reports that have a non-null draft comment and map them to their corresponding report objects from allReports
    // This ensures that any report with a draft comment is preserved in Onyx even if it doesn’t contain chat history
    const reportsWithDraftComments = Object.entries(allReportsWithDraftComments ?? {})
        .filter(([, value]) => value !== null)
        .map(([key]) => key.replace(ONYXKEYS_1.default.COLLECTION.REPORT_DRAFT_COMMENT, ''))
        .map((reportID) => allReports?.[`${ONYXKEYS_1.default.COLLECTION.REPORT}${reportID}`]);
    reportsWithDraftComments?.forEach((report) => {
        result.successData?.push({
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: `${ONYXKEYS_1.default.COLLECTION.REPORT}${report?.reportID}`,
            value: {
                ...report,
            },
        });
    });
    return result;
}
/**
 * Fetches data needed for app initialization
 */
function openApp(shouldKeepPublicRooms = false, allReportsWithDraftComments) {
    return getPolicyParamsForOpenOrReconnect().then((policyParams) => {
        const params = { enablePriorityModeFilter: true, ...policyParams };
        return API.writeWithNoDuplicatesConflictAction(types_1.WRITE_COMMANDS.OPEN_APP, params, getOnyxDataForOpenOrReconnect(true, undefined, shouldKeepPublicRooms, allReportsWithDraftComments));
    });
}
/**
 * Fetches data when the app reconnects to the network
 * @param [updateIDFrom] the ID of the Onyx update that we want to start fetching from
 */
function reconnectApp(updateIDFrom = 0) {
    hasLoadedAppPromise.then(() => {
        if (!hasLoadedApp) {
            openApp();
            return;
        }
        console.debug(`[OnyxUpdates] App reconnecting with updateIDFrom: ${updateIDFrom}`);
        getPolicyParamsForOpenOrReconnect().then((policyParams) => {
            const params = policyParams;
            // Include the update IDs when reconnecting so that the server can send incremental updates if they are available.
            // Otherwise, a full set of app data will be returned.
            if (updateIDFrom) {
                params.updateIDFrom = updateIDFrom;
            }
            const isFullReconnect = !updateIDFrom;
            API.writeWithNoDuplicatesConflictAction(types_1.WRITE_COMMANDS.RECONNECT_APP, params, getOnyxDataForOpenOrReconnect(false, isFullReconnect, isSidebarLoaded));
        });
    });
}
/**
 * Fetches data when the app will call reconnectApp without params for the last time. This is a separate function
 * because it will follow patterns that are not recommended so we can be sure we're not putting the app in a unusable
 * state because of race conditions between reconnectApp and other pusher updates being applied at the same time.
 */
function finalReconnectAppAfterActivatingReliableUpdates() {
    console.debug(`[OnyxUpdates] Executing last reconnect app with promise`);
    return getPolicyParamsForOpenOrReconnect().then((policyParams) => {
        const params = { ...policyParams };
        // It is SUPER BAD FORM to return promises from action methods.
        // DO NOT FOLLOW THIS PATTERN!!!!!
        // It was absolutely necessary in order to not break the app while migrating to the new reliable updates pattern. This method will be removed
        // as soon as we have everyone migrated to the reliableUpdate beta.
        // eslint-disable-next-line rulesdir/no-api-side-effects-method
        return API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.RECONNECT_APP, params, getOnyxDataForOpenOrReconnect(false, true));
    });
}
/**
 * Fetches data when the client has discovered it missed some Onyx updates from the server
 * @param [updateIDFrom] the ID of the Onyx update that we want to start fetching from
 * @param [updateIDTo] the ID of the Onyx update that we want to fetch up to
 */
function getMissingOnyxUpdates(updateIDFrom = 0, updateIDTo = 0) {
    console.debug(`[OnyxUpdates] Fetching missing updates updateIDFrom: ${updateIDFrom} and updateIDTo: ${updateIDTo}`);
    const parameters = {
        updateIDFrom,
        updateIDTo,
    };
    // It is SUPER BAD FORM to return promises from action methods.
    // DO NOT FOLLOW THIS PATTERN!!!!!
    // It was absolutely necessary in order to block OnyxUpdates while fetching the missing updates from the server or else the updates aren't applied in the proper order.
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    return API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.GET_MISSING_ONYX_MESSAGES, parameters, getOnyxDataForOpenOrReconnect());
}
/**
 * This promise is used so that deeplink component know when a transition is end.
 * This is necessary because we want to begin deeplink redirection after the transition is end.
 */
let resolveSignOnTransitionToFinishPromise;
const signOnTransitionToFinishPromise = new Promise((resolve) => {
    resolveSignOnTransitionToFinishPromise = resolve;
});
function waitForSignOnTransitionToFinish() {
    return signOnTransitionToFinishPromise;
}
function endSignOnTransition() {
    return resolveSignOnTransitionToFinishPromise();
}
/**
 * Create a new draft workspace and navigate to it
 *
 * @param [policyOwnerEmail] Optional, the email of the account to make the owner of the policy
 * @param [policyName] Optional, custom policy name we will use for created workspace
 * @param [transitionFromOldDot] Optional, if the user is transitioning from old dot
 * @param [makeMeAdmin] Optional, leave the calling account as an admin on the policy
 * @param [backTo] An optional return path. If provided, it will be URL-encoded and appended to the resulting URL.
 * @param [policyID] Optional, Policy id.
 * @param [currency] Optional, selected currency for the workspace
 * @param [file], avatar file for workspace
 * @param [routeToNavigateAfterCreate], Optional, route to navigate after creating a workspace
 */
function createWorkspaceWithPolicyDraftAndNavigateToIt(policyOwnerEmail = '', policyName = '', transitionFromOldDot = false, makeMeAdmin = false, backTo = '', policyID = '', currency, file, routeToNavigateAfterCreate, lastUsedPaymentMethod) {
    const policyIDWithDefault = policyID || (0, Policy_1.generatePolicyID)();
    (0, Policy_1.createDraftInitialWorkspace)(policyOwnerEmail, policyName, policyIDWithDefault, makeMeAdmin, currency, file);
    Navigation_1.default.isNavigationReady()
        .then(() => {
        if (transitionFromOldDot) {
            // We must call goBack() to remove the /transition route from history
            Navigation_1.default.goBack();
        }
        const routeToNavigate = routeToNavigateAfterCreate ?? ROUTES_1.default.WORKSPACE_INITIAL.getRoute(policyIDWithDefault, backTo);
        savePolicyDraftByNewWorkspace(policyIDWithDefault, policyName, policyOwnerEmail, makeMeAdmin, currency, file, lastUsedPaymentMethod);
        Navigation_1.default.navigate(routeToNavigate, { forceReplace: !transitionFromOldDot });
    })
        .then(endSignOnTransition);
}
/**
 * Create a new workspace and delete the draft
 *
 * @param [policyID] the ID of the policy to use
 * @param [policyName] custom policy name we will use for created workspace
 * @param [policyOwnerEmail] Optional, the email of the account to make the owner of the policy
 * @param [makeMeAdmin] Optional, leave the calling account as an admin on the policy
 * @param [currency] Optional, selected currency for the workspace
 * @param [file] Optional, avatar file for workspace
 */
function savePolicyDraftByNewWorkspace(policyID, policyName, policyOwnerEmail = '', makeMeAdmin = false, currency = '', file, lastUsedPaymentMethod) {
    (0, Policy_1.createWorkspace)({
        policyOwnerEmail,
        makeMeAdmin,
        policyName,
        policyID,
        engagementChoice: CONST_1.default.ONBOARDING_CHOICES.MANAGE_TEAM,
        currency,
        file,
        lastUsedPaymentMethod,
    });
}
/**
 * This action runs when the Navigator is ready and the current route changes
 *
 * currentPath should be the path as reported by the NavigationContainer
 *
 * The transition link contains an exitTo param that contains the route to
 * navigate to after the user is signed in. A user can transition from OldDot
 * with a different account than the one they are currently signed in with, so
 * we only navigate if they are not signing in as a new user. Once they are
 * signed in as that new user, this action will run again and the navigation
 * will occur.

 * When the exitTo route is 'workspace/new', we create a new
 * workspace and navigate to it
 *
 * We subscribe to the session using withOnyx in the AuthScreens and
 * pass it in as a parameter. withOnyx guarantees that the value has been read
 * from Onyx because it will not render the AuthScreens until that point.
 */
function setUpPoliciesAndNavigate(session) {
    const currentUrl = (0, currentUrl_1.default)();
    if (!session || !currentUrl?.includes('exitTo')) {
        endSignOnTransition();
        return;
    }
    const isLoggingInAsNewUser = !!session.email && (0, SessionUtils_1.isLoggingInAsNewUser)(currentUrl, session.email);
    const url = new URL(currentUrl);
    const exitTo = url.searchParams.get('exitTo');
    // Approved Accountants and Guides can enter a flow where they make a workspace for other users,
    // and those are passed as a search parameter when using transition links
    const policyOwnerEmail = url.searchParams.get('ownerEmail') ?? '';
    const makeMeAdmin = !!url.searchParams.get('makeMeAdmin');
    const policyName = url.searchParams.get('policyName') ?? '';
    // Sign out the current user if we're transitioning with a different user
    const isTransitioning = expensify_common_1.Str.startsWith(url.pathname, expensify_common_1.Str.normalizeUrl(ROUTES_1.default.TRANSITION_BETWEEN_APPS));
    const shouldCreateFreePolicy = !isLoggingInAsNewUser && isTransitioning && exitTo === ROUTES_1.default.WORKSPACE_NEW;
    if (shouldCreateFreePolicy) {
        createWorkspaceWithPolicyDraftAndNavigateToIt(policyOwnerEmail, policyName, true, makeMeAdmin);
        return;
    }
    if (!isLoggingInAsNewUser && exitTo) {
        Navigation_1.default.waitForProtectedRoutes()
            .then(() => {
            Navigation_1.default.navigate(exitTo);
        })
            .then(endSignOnTransition);
    }
    else {
        endSignOnTransition();
    }
}
function redirectThirdPartyDesktopSignIn() {
    const currentUrl = (0, currentUrl_1.default)();
    if (!currentUrl) {
        return;
    }
    const url = new URL(currentUrl);
    if (url.pathname === `/${ROUTES_1.default.GOOGLE_SIGN_IN}` || url.pathname === `/${ROUTES_1.default.APPLE_SIGN_IN}`) {
        Navigation_1.default.isNavigationReady().then(() => {
            Navigation_1.default.goBack();
            Navigation_1.default.navigate(ROUTES_1.default.DESKTOP_SIGN_IN_REDIRECT);
        });
    }
}
/**
 * @param shouldAuthenticateWithCurrentAccount Optional, indicates whether default authentication method (shortLivedAuthToken) should be used
 */
function beginDeepLinkRedirect(shouldAuthenticateWithCurrentAccount = true, isMagicLink, initialRoute) {
    // There's no support for anonymous users on desktop
    if ((0, Session_1.isAnonymousUser)()) {
        return;
    }
    // If the route that is being handled is a magic link, email and shortLivedAuthToken should not be attached to the url
    // to prevent signing into the wrong account
    if (!currentSessionData.accountID || !shouldAuthenticateWithCurrentAccount) {
        Browser.openRouteInDesktopApp();
        return;
    }
    const parameters = { shouldRetry: false };
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.OPEN_OLD_DOT_LINK, parameters, {}).then((response) => {
        if (!response) {
            Log_1.default.alert('Trying to redirect via deep link, but the response is empty. User likely not authenticated.', { response, shouldAuthenticateWithCurrentAccount, currentUserAccountID: currentSessionData.accountID }, true);
            return;
        }
        Browser.openRouteInDesktopApp(response.shortLivedAuthToken, currentSessionData.email, isMagicLink ? '/r' : initialRoute);
    });
}
/**
 * @param shouldAuthenticateWithCurrentAccount Optional, indicates whether default authentication method (shortLivedAuthToken) should be used
 */
function beginDeepLinkRedirectAfterTransition(shouldAuthenticateWithCurrentAccount = true) {
    waitForSignOnTransitionToFinish().then(() => beginDeepLinkRedirect(shouldAuthenticateWithCurrentAccount));
}
function handleRestrictedEvent(eventName) {
    const parameters = { eventName };
    API.write(types_1.WRITE_COMMANDS.HANDLE_RESTRICTED_EVENT, parameters);
}
function updateLastVisitedPath(path) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.LAST_VISITED_PATH, path);
}
function updateLastRoute(screen) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.LAST_ROUTE, screen);
}
function setIsUsingImportedState(usingImportedState) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.IS_USING_IMPORTED_STATE, usingImportedState);
}
function setPreservedUserSession(session) {
    react_native_onyx_1.default.set(ONYXKEYS_1.default.PRESERVED_USER_SESSION, session);
}
function clearOnyxAndResetApp(shouldNavigateToHomepage) {
    // The value of isUsingImportedState will be lost once Onyx is cleared, so we need to store it
    const isStateImported = isUsingImportedState;
    const sequentialQueue = (0, PersistedRequests_1.getAll)();
    (0, PersistedRequests_1.rollbackOngoingRequest)();
    Navigation_1.default.clearPreloadedRoutes();
    react_native_onyx_1.default.clear(KEYS_TO_PRESERVE)
        .then(() => {
        // Network key is preserved, so when using imported state, we should stop forcing offline mode so that the app can re-fetch the network
        if (isStateImported) {
            (0, Network_1.setShouldForceOffline)(false);
        }
        if (shouldNavigateToHomepage) {
            Navigation_1.default.navigate(ROUTES_1.default.HOME);
        }
        if (preservedUserSession) {
            react_native_onyx_1.default.set(ONYXKEYS_1.default.SESSION, preservedUserSession);
            react_native_onyx_1.default.set(ONYXKEYS_1.default.PRESERVED_USER_SESSION, null);
        }
    })
        .then(() => {
        // Requests in a sequential queue should be called even if the Onyx state is reset, so we do not lose any pending data.
        // However, the OpenApp request must be called before any other request in a queue to ensure data consistency.
        // To do that, sequential queue is cleared together with other keys, and then it's restored once the OpenApp request is resolved.
        openApp().then(() => {
            if (!sequentialQueue || isStateImported) {
                return;
            }
            sequentialQueue.forEach((request) => {
                (0, PersistedRequests_1.save)(request);
            });
        });
    });
    (0, Sound_1.clearSoundAssetsCache)();
}
