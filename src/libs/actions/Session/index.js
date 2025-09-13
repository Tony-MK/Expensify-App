"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canAnonymousUserAccessRoute = exports.reauthenticatePusher = void 0;
exports.beginSignIn = beginSignIn;
exports.beginAppleSignIn = beginAppleSignIn;
exports.beginGoogleSignIn = beginGoogleSignIn;
exports.setSupportAuthToken = setSupportAuthToken;
exports.callFunctionIfActionIsAllowed = callFunctionIfActionIsAllowed;
exports.signIn = signIn;
exports.signInWithValidateCode = signInWithValidateCode;
exports.handleExitToNavigation = handleExitToNavigation;
exports.signInWithValidateCodeAndNavigate = signInWithValidateCodeAndNavigate;
exports.initAutoAuthState = initAutoAuthState;
exports.signInWithShortLivedAuthToken = signInWithShortLivedAuthToken;
exports.cleanupSession = cleanupSession;
exports.signOut = signOut;
exports.signOutAndRedirectToSignIn = signOutAndRedirectToSignIn;
exports.resendValidateCode = resendValidateCode;
exports.requestUnlinkValidationLink = requestUnlinkValidationLink;
exports.unlinkLogin = unlinkLogin;
exports.clearSignInData = clearSignInData;
exports.clearAccountMessages = clearAccountMessages;
exports.setAccountError = setAccountError;
exports.authenticatePusher = authenticatePusher;
exports.invalidateCredentials = invalidateCredentials;
exports.invalidateAuthToken = invalidateAuthToken;
exports.expireSessionWithDelay = expireSessionWithDelay;
exports.isAnonymousUser = isAnonymousUser;
exports.toggleTwoFactorAuth = toggleTwoFactorAuth;
exports.validateTwoFactorAuth = validateTwoFactorAuth;
exports.waitForUserSignIn = waitForUserSignIn;
exports.hasAuthToken = hasAuthToken;
exports.isExpiredSession = isExpiredSession;
exports.signInWithSupportAuthToken = signInWithSupportAuthToken;
exports.isSupportAuthToken = isSupportAuthToken;
exports.hasStashedSession = hasStashedSession;
exports.signUpUser = signUpUser;
exports.setupNewDotAfterTransitionFromOldDot = setupNewDotAfterTransitionFromOldDot;
exports.AddWorkEmail = AddWorkEmail;
exports.MergeIntoAccountAndLogin = MergeIntoAccountAndLogin;
exports.resetSMSDeliveryFailureStatus = resetSMSDeliveryFailureStatus;
exports.clearDisableTwoFactorAuthErrors = clearDisableTwoFactorAuthErrors;
exports.getShortLivedLoginParams = getShortLivedLoginParams;
const react_native_hybrid_app_1 = require("@expensify/react-native-hybrid-app");
const throttle_1 = require("lodash/throttle");
const react_native_1 = require("react-native");
const react_native_onyx_1 = require("react-native-onyx");
const HybridApp_1 = require("@libs/actions/HybridApp");
const PersistedRequests = require("@libs/actions/PersistedRequests");
const API = require("@libs/API");
const types_1 = require("@libs/API/types");
const asyncOpenURL_1 = require("@libs/asyncOpenURL");
const Authentication = require("@libs/Authentication");
const ErrorUtils = require("@libs/ErrorUtils");
const Fullstory_1 = require("@libs/Fullstory");
const HttpUtils_1 = require("@libs/HttpUtils");
const Localize_1 = require("@libs/Localize");
const Log_1 = require("@libs/Log");
const Navigation_1 = require("@libs/Navigation/Navigation");
const navigationRef_1 = require("@libs/Navigation/navigationRef");
const MainQueue = require("@libs/Network/MainQueue");
const NetworkStore = require("@libs/Network/NetworkStore");
const NetworkStore_1 = require("@libs/Network/NetworkStore");
const SequentialQueue = require("@libs/Network/SequentialQueue");
const NetworkConnection_1 = require("@libs/NetworkConnection");
const Pusher_1 = require("@libs/Pusher");
const ReportUtils_1 = require("@libs/ReportUtils");
const SessionUtils = require("@libs/SessionUtils");
const SessionUtils_1 = require("@libs/SessionUtils");
const Sound_1 = require("@libs/Sound");
const Timers_1 = require("@libs/Timers");
const ReportActionContextMenu_1 = require("@pages/home/report/ContextMenu/ReportActionContextMenu");
const App_1 = require("@userActions/App");
const Delegate_1 = require("@userActions/Delegate");
const Device = require("@userActions/Device");
const HybridAppActions = require("@userActions/HybridApp");
const SignInRedirect_1 = require("@userActions/SignInRedirect");
const Timing_1 = require("@userActions/Timing");
const Welcome = require("@userActions/Welcome");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const NAVIGATORS_1 = require("@src/NAVIGATORS");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const clearCache_1 = require("./clearCache");
const updateSessionAuthTokens_1 = require("./updateSessionAuthTokens");
const INVALID_TOKEN = 'pizza';
let session = {};
let authPromiseResolver = null;
let isHybridAppSetupFinished = false;
let hasSwitchedAccountInHybridMode = false;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.SESSION,
    callback: (value) => {
        session = value ?? {};
        if (!session?.authToken && isHybridAppSetupFinished) {
            (0, HybridApp_1.migrateHybridAppToNewPartnerName)();
        }
        if (!session.creationDate) {
            session.creationDate = new Date().getTime();
        }
        if (session.authToken && authPromiseResolver) {
            authPromiseResolver(true);
            authPromiseResolver = null;
        }
        if (CONFIG_1.default.IS_HYBRID_APP && isHybridAppSetupFinished && session.authToken && session.authToken !== INVALID_TOKEN && !isAnonymousUser(value)) {
            react_native_hybrid_app_1.default.sendAuthToken({ authToken: session.authToken });
        }
    },
});
// Use connectWithoutView because it is only for fullstory initialization
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.USER_METADATA,
    callback: Fullstory_1.default.consentAndIdentify,
});
let stashedSession = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.STASHED_SESSION,
    callback: (value) => (stashedSession = value ?? {}),
});
let credentials = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.CREDENTIALS,
    callback: (value) => (credentials = value ?? {}),
});
let stashedCredentials = {};
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.STASHED_CREDENTIALS,
    callback: (value) => (stashedCredentials = value ?? {}),
});
let preferredLocale = null;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_PREFERRED_LOCALE,
    callback: (val) => (preferredLocale = val ?? null),
});
let activePolicyID;
react_native_onyx_1.default.connect({
    key: ONYXKEYS_1.default.NVP_ACTIVE_POLICY_ID,
    callback: (newActivePolicyID) => {
        activePolicyID = newActivePolicyID;
    },
});
function isSupportAuthToken() {
    return session.authTokenType === CONST_1.default.AUTH_TOKEN_TYPES.SUPPORT;
}
/**
 * Sets the SupportToken. This method will only be used on dev.
 */
function setSupportAuthToken(supportAuthToken, email, accountID) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, {
        authTokenType: CONST_1.default.AUTH_TOKEN_TYPES.SUPPORT,
        authToken: supportAuthToken,
        email,
        accountID,
        creationDate: new Date().getTime(),
    }).then(() => {
        Log_1.default.info('[Supportal] Auth token set');
    });
    react_native_onyx_1.default.set(ONYXKEYS_1.default.LAST_VISITED_PATH, '');
}
function getShortLivedLoginParams(isSupportAuthTokenUsed = false) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                ...CONST_1.default.DEFAULT_ACCOUNT_DATA,
                isLoading: true,
            },
        },
        // We are making a temporary modification to 'signedInWithShortLivedAuthToken' to ensure that 'App.openApp' will be called at least once
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.SESSION,
            value: {
                signedInWithShortLivedAuthToken: true,
                isAuthenticatingWithShortLivedToken: true,
                isSupportAuthTokenUsed,
            },
        },
    ];
    // Subsequently, we revert it back to the default value of 'signedInWithShortLivedAuthToken' in 'finallyData' to ensure the user is logged out on refresh
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.SESSION,
            value: {
                signedInWithShortLivedAuthToken: null,
                isSupportAuthTokenUsed: null,
                isAuthenticatingWithShortLivedToken: false,
            },
        },
    ];
    return { optimisticData, finallyData };
}
/**
 * This method should be used when we are being redirected from oldDot to NewDot on a supportal request
 */
function signInWithSupportAuthToken(authToken) {
    const { optimisticData, finallyData } = getShortLivedLoginParams(true);
    API.read(types_1.READ_COMMANDS.SIGN_IN_WITH_SUPPORT_AUTH_TOKEN, { authToken }, { optimisticData, finallyData });
}
/**
 * Clears the Onyx store and redirects user to the sign in page
 */
function signOut() {
    return NetworkStore.hasReadShouldUseNewPartnerNameFromStorage().then(() => {
        Log_1.default.info('Flushing logs before signing out', true, {}, true);
        const shouldUseNewPartnerName = NetworkStore.getShouldUseNewPartnerName();
        const params = {
            // Send current authToken because we will immediately clear it once triggering this command
            authToken: NetworkStore.getAuthToken() ?? null,
            partnerUserID: credentials?.autoGeneratedLogin ?? '',
            partnerName: shouldUseNewPartnerName ? CONFIG_1.default.EXPENSIFY.PARTNER_NAME : CONFIG_1.default.EXPENSIFY.LEGACY_PARTNER_NAME,
            partnerPassword: shouldUseNewPartnerName ? CONFIG_1.default.EXPENSIFY.PARTNER_PASSWORD : CONFIG_1.default.EXPENSIFY.LEGACY_PARTNER_PASSWORD,
            shouldRetry: false,
            skipReauthentication: true,
        };
        // eslint-disable-next-line rulesdir/no-api-side-effects-method
        return API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.LOG_OUT, params, {});
    });
}
/**
 * Checks if the account is an anonymous account.
 */
function isAnonymousUser(sessionParam) {
    return (sessionParam?.authTokenType ?? session.authTokenType) === CONST_1.default.AUTH_TOKEN_TYPES.ANONYMOUS;
}
function hasStashedSession() {
    return !!(stashedSession.authToken && stashedCredentials.autoGeneratedLogin && stashedCredentials.autoGeneratedLogin !== '');
}
/**
 * Checks if the user has authToken
 */
function hasAuthToken() {
    return !!session.authToken;
}
/**
 * Indicates if the session which creation date is in parameter is expired
 * @param sessionCreationDate the session creation date timestamp
 */
function isExpiredSession(sessionCreationDate) {
    return new Date().getTime() - sessionCreationDate >= CONST_1.default.SESSION_EXPIRATION_TIME_MS;
}
function signOutAndRedirectToSignIn(shouldResetToHome, shouldStashSession, shouldSignOutFromOldDot = true, shouldForceUseStashedSession) {
    Log_1.default.info('Redirecting to Sign In because signOut() was called');
    (0, ReportActionContextMenu_1.hideContextMenu)(false);
    if (isAnonymousUser()) {
        if (!Navigation_1.default.isActiveRoute(ROUTES_1.default.SIGN_IN_MODAL)) {
            if (shouldResetToHome) {
                Navigation_1.default.resetToHome();
            }
            Navigation_1.default.navigate(ROUTES_1.default.SIGN_IN_MODAL);
            react_native_1.Linking.getInitialURL().then((url) => {
                const reportID = (0, ReportUtils_1.getReportIDFromLink)(url);
                if (reportID) {
                    react_native_onyx_1.default.merge(ONYXKEYS_1.default.LAST_OPENED_PUBLIC_ROOM_ID, reportID);
                }
            });
        }
        return;
    }
    // When signing out from the HybridApp, we need to sign out from the oldDot app as well
    if (CONFIG_1.default.IS_HYBRID_APP && shouldSignOutFromOldDot) {
        react_native_hybrid_app_1.default.signOutFromOldDot();
    }
    const isSupportal = isSupportAuthToken();
    const shouldRestoreStashedSession = isSupportal || shouldForceUseStashedSession;
    // We'll only call signOut if we're not stashing the session and not restoring a stashed session,
    // otherwise we'll call the API to invalidate the autogenerated credentials used for infinite
    // session.
    const signOutPromise = !shouldRestoreStashedSession && !shouldStashSession ? signOut() : Promise.resolve();
    // The function redirectToSignIn will clear the whole storage, so let's create our onyx params
    // updates for the credentials before we call it
    let onyxSetParams = {};
    // If we are not currently using a support token, and we received stashSession as true, we need to
    // store the credentials so the user doesn't need to login again after they finish their supportal
    // action. This needs to computed before we call `redirectToSignIn`
    if (!isSupportal && shouldStashSession) {
        onyxSetParams = {
            [ONYXKEYS_1.default.STASHED_CREDENTIALS]: credentials,
            [ONYXKEYS_1.default.STASHED_SESSION]: session,
        };
    }
    // If this is a supportal token, and we've received the parameters to stashSession as true, and
    // we already have a stashedSession, that means we are supportal-ed, currently supportal-ing
    // into another account and we want to keep the stashed data from the original account.
    if (isSupportal && shouldStashSession && hasStashedSession()) {
        onyxSetParams = {
            [ONYXKEYS_1.default.STASHED_CREDENTIALS]: stashedCredentials,
            [ONYXKEYS_1.default.STASHED_SESSION]: stashedSession,
        };
    }
    // If we should restore the stashed session, and we do not want to stash the current session, and we have a
    // stashed session, then switch the account instead of completely logging out.
    if (shouldRestoreStashedSession && !shouldStashSession && hasStashedSession()) {
        if (CONFIG_1.default.IS_HYBRID_APP) {
            react_native_hybrid_app_1.default.switchAccount({
                newDotCurrentAccountEmail: stashedSession.email ?? '',
                authToken: stashedSession.authToken ?? '',
                // eslint-disable-next-line rulesdir/no-default-id-values
                policyID: activePolicyID ?? '',
                accountID: session.accountID ? String(session.accountID) : '',
            });
            hasSwitchedAccountInHybridMode = true;
        }
        onyxSetParams = {
            [ONYXKEYS_1.default.CREDENTIALS]: stashedCredentials,
            [ONYXKEYS_1.default.SESSION]: stashedSession,
        };
    }
    if (shouldRestoreStashedSession && !shouldStashSession && !hasStashedSession()) {
        Log_1.default.info('No stashed session found, clearing the session');
    }
    // Wait for signOut (if called), then redirect and update Onyx.
    return signOutPromise
        .then((response) => {
        if (response?.hasOldDotAuthCookies) {
            Log_1.default.info('Redirecting to OldDot sign out');
            (0, asyncOpenURL_1.default)((0, SignInRedirect_1.default)().then(() => {
                react_native_onyx_1.default.multiSet(onyxSetParams);
            }), `${CONFIG_1.default.EXPENSIFY.EXPENSIFY_URL}${CONST_1.default.OLDDOT_URLS.SIGN_OUT}`, true, true);
        }
        else {
            (0, SignInRedirect_1.default)().then(() => {
                react_native_onyx_1.default.multiSet(onyxSetParams);
                if (hasSwitchedAccountInHybridMode) {
                    (0, App_1.openApp)();
                }
            });
        }
    })
        .catch((error) => Log_1.default.warn('Error during sign out process:', error));
}
/**
 * @param callback The callback to execute if the action is allowed
 * @param isAnonymousAction The action is allowed for anonymous or not
 * @returns same callback if the action is allowed, otherwise a function that signs out and redirects to sign in
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function callFunctionIfActionIsAllowed(callback, isAnonymousAction = false) {
    if (isAnonymousUser() && !isAnonymousAction) {
        return () => {
            signOutAndRedirectToSignIn();
        };
    }
    return callback;
}
/**
 * Request a new validate / magic code for user to sign in via passwordless flow
 */
function resendValidateCode(login = credentials.login) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                errors: null,
                loadingForm: CONST_1.default.FORMS.RESEND_VALIDATE_CODE_FORM,
            },
        },
    ];
    const finallyData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                loadingForm: null,
            },
        },
    ];
    const params = { email: login };
    API.write(types_1.WRITE_COMMANDS.REQUEST_NEW_VALIDATE_CODE, params, { optimisticData, finallyData });
}
/**
 * Constructs the state object for the BeginSignIn && BeginAppleSignIn API calls.
 */
function signInAttemptState() {
    return {
        optimisticData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.ACCOUNT,
                value: {
                    ...CONST_1.default.DEFAULT_ACCOUNT_DATA,
                    isLoading: true,
                    message: null,
                    loadingForm: CONST_1.default.FORMS.LOGIN_FORM,
                },
            },
        ],
        successData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.ACCOUNT,
                value: {
                    isLoading: false,
                    loadingForm: null,
                },
            },
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.CREDENTIALS,
                value: {
                    validateCode: null,
                },
            },
        ],
        failureData: [
            {
                onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
                key: ONYXKEYS_1.default.ACCOUNT,
                value: {
                    isLoading: false,
                    loadingForm: null,
                    errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('loginForm.cannotGetAccountDetails'),
                },
            },
        ],
    };
}
/**
 * Checks the API to see if an account exists for the given login.
 */
function beginSignIn(email) {
    const { optimisticData, successData, failureData } = signInAttemptState();
    const params = { email };
    API.read(types_1.READ_COMMANDS.BEGIN_SIGNIN, params, { optimisticData, successData, failureData });
}
/**
 * Create Onyx update to clean up anonymous user data
 */
function buildOnyxDataToCleanUpAnonymousUser() {
    const data = {};
    if (session.authTokenType === CONST_1.default.AUTH_TOKEN_TYPES.ANONYMOUS && session.accountID) {
        data[session.accountID] = null;
    }
    return {
        key: ONYXKEYS_1.default.PERSONAL_DETAILS_LIST,
        value: data,
        onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
    };
}
/**
 * Creates an account for the new user and signs them into the application with the newly created account.
 *
 */
function signUpUser() {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                ...CONST_1.default.DEFAULT_ACCOUNT_DATA,
                isLoading: true,
            },
        },
    ];
    const onyxOperationToCleanUpAnonymousUser = buildOnyxDataToCleanUpAnonymousUser();
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
            },
        },
        onyxOperationToCleanUpAnonymousUser,
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
            },
        },
    ];
    const params = { email: credentials.login, preferredLocale };
    API.write(types_1.WRITE_COMMANDS.SIGN_UP_USER, params, { optimisticData, successData, failureData });
}
function setupNewDotAfterTransitionFromOldDot(hybridAppSettings, tryNewDot) {
    const { hybridApp, ...newDotOnyxValues } = hybridAppSettings;
    const clearOnyxIfSigningIn = () => {
        if (!hybridApp.useNewDotSignInPage) {
            return Promise.resolve();
        }
        Log_1.default.info(`[HybridApp] Clearing onyx after transition from OldDot. useNewDotSignInPage set to ${hybridApp.useNewDotSignInPage}`);
        return (0, SignInRedirect_1.default)();
    };
    const resetDidUserLoginDuringSessionIfNeeded = () => {
        if (newDotOnyxValues.nvp_tryNewDot === undefined || tryNewDot?.classicRedirect?.dismissed !== true) {
            return Promise.resolve();
        }
        Log_1.default.info("[HybridApp] OpenApp hasn't been called yet. Calling `resetDidUserLogInDuringSession`");
        (0, SessionUtils_1.resetDidUserLogInDuringSession)();
    };
    return clearOnyxIfSigningIn()
        .then(() => {
        // This section controls copilot changes
        const currentUserEmail = (0, NetworkStore_1.getCurrentUserEmail)();
        // If ND and OD account are the same - do nothing
        if (hybridApp?.delegateAccessData?.oldDotCurrentUserEmail === currentUserEmail) {
            Log_1.default.info('[HybridApp] User did not switch account on OldDot side');
            return;
        }
        const stashedData = hybridApp?.delegateAccessData?.isDelegateAccess
            ? {
                [ONYXKEYS_1.default.STASHED_CREDENTIALS]: credentials,
                [ONYXKEYS_1.default.STASHED_SESSION]: session,
            }
            : {
                [ONYXKEYS_1.default.STASHED_CREDENTIALS]: {},
                [ONYXKEYS_1.default.STASHED_SESSION]: {},
            };
        Log_1.default.info('[HybridApp] User switched account on OldDot side. Clearing onyx and applying delegate data');
        return react_native_onyx_1.default.clear(Delegate_1.KEYS_TO_PRESERVE_DELEGATE_ACCESS).then(() => react_native_onyx_1.default.multiSet({
            ...stashedData,
            [ONYXKEYS_1.default.SESSION]: {
                email: hybridApp?.delegateAccessData?.oldDotCurrentUserEmail,
                authToken: hybridApp?.delegateAccessData?.oldDotCurrentAuthToken,
                encryptedAuthToken: decodeURIComponent(hybridApp?.delegateAccessData?.oldDotCurrentEncryptedAuthToken ?? ''),
                accountID: hybridApp?.delegateAccessData?.oldDotCurrentAccountID,
            },
            // When a logged-in user opens NewDot for the first time after migrating to the new SignInPage, there will be no credentials on the NewDot side.
            // After migration, NewDot is responsible for creating credentials, but this only happens during sign-in.
            // To avoid blocking the transition, we fall back to credentials from OldDot in this scenario.
            // The `delegateAccessData` key is misleading in this context because, in the past, this code only handled Copilot. We are reusing the same logic here for this scenario.
            [ONYXKEYS_1.default.CREDENTIALS]: {
                autoGeneratedLogin: credentials?.autoGeneratedLogin ?? hybridApp.delegateAccessData?.oldDotAutoGeneratedLogin,
                autoGeneratedPassword: credentials?.autoGeneratedPassword ?? hybridApp.delegateAccessData?.oldDotAutoGeneratedPassword,
            },
        })
            .then(() => react_native_onyx_1.default.merge(ONYXKEYS_1.default.ACCOUNT, { primaryLogin: hybridApp?.delegateAccessData?.oldDotCurrentUserEmail }))
            .then(() => {
            Log_1.default.info('[HybridApp] Calling openApp to get delegate account details');
            (0, App_1.confirmReadyToOpenApp)();
            return (0, App_1.openApp)();
        }));
    })
        .then(() => HybridAppActions.prepareHybridAppAfterTransitionToNewDot({
        ...hybridApp,
        closingReactNativeApp: false,
    }))
        .then(resetDidUserLoginDuringSessionIfNeeded)
        .then(() => Promise.all(Object.entries(newDotOnyxValues).map(([key, value]) => react_native_onyx_1.default.merge(key, value ?? {}))))
        .then(() => {
        Log_1.default.info('[HybridApp] Setup after transition from OldDot finished');
        isHybridAppSetupFinished = true;
        return Promise.resolve();
    })
        .catch((error) => {
        Log_1.default.hmmm('[HybridApp] Initialization of HybridApp has failed. Forcing transition', { error });
    });
}
/**
 * Given an idToken from Sign in with Apple, checks the API to see if an account
 * exists for that email address and signs the user in if so.
 */
function beginAppleSignIn(idToken) {
    const { optimisticData, successData, failureData } = signInAttemptState();
    const params = { idToken, preferredLocale };
    API.write(types_1.WRITE_COMMANDS.SIGN_IN_WITH_APPLE, params, { optimisticData, successData, failureData });
}
/**
 * Shows Google sign-in process, and if an auth token is successfully obtained,
 * passes the token on to the Expensify API to sign in with
 */
function beginGoogleSignIn(token) {
    const { optimisticData, successData, failureData } = signInAttemptState();
    const params = { token, preferredLocale };
    API.write(types_1.WRITE_COMMANDS.SIGN_IN_WITH_GOOGLE, params, { optimisticData, successData, failureData });
}
/**
 * Will create a temporary login for the user in the passed authenticate response which is used when
 * re-authenticating after an authToken expires.
 */
function signInWithShortLivedAuthToken(authToken) {
    const { optimisticData, finallyData } = getShortLivedLoginParams();
    API.read(types_1.READ_COMMANDS.SIGN_IN_WITH_SHORT_LIVED_AUTH_TOKEN, { authToken, skipReauthentication: true }, { optimisticData, finallyData });
    NetworkStore.setLastShortAuthToken(authToken);
}
/**
 * Sign the user into the application. This will first authenticate their account
 * then it will create a temporary login for them which is used when re-authenticating
 * after an authToken expires.
 *
 * @param validateCode - 6 digit code required for login
 */
function signIn(validateCode, twoFactorAuthCode) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                ...CONST_1.default.DEFAULT_ACCOUNT_DATA,
                isLoading: true,
                loadingForm: twoFactorAuthCode ? CONST_1.default.FORMS.VALIDATE_TFA_CODE_FORM : CONST_1.default.FORMS.VALIDATE_CODE_FORM,
            },
        },
    ];
    const onyxOperationToCleanUpAnonymousUser = buildOnyxDataToCleanUpAnonymousUser();
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
                loadingForm: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CREDENTIALS,
            value: {
                validateCode,
            },
        },
        onyxOperationToCleanUpAnonymousUser,
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
                loadingForm: null,
            },
        },
    ];
    Device.getDeviceInfoWithID().then((deviceInfo) => {
        const params = {
            twoFactorAuthCode,
            email: credentials.login,
            preferredLocale,
            deviceInfo,
        };
        // Conditionally pass a password or validateCode to command since we temporarily allow both flows
        if (validateCode || twoFactorAuthCode) {
            params.validateCode = validateCode || credentials.validateCode;
        }
        API.write(types_1.WRITE_COMMANDS.SIGN_IN_USER, params, { optimisticData, successData, failureData });
    });
}
function signInWithValidateCode(accountID, code, twoFactorAuthCode = '') {
    // If this is called from the 2fa step, get the validateCode directly from onyx
    // instead of the one passed from the component state because the state is changing when this method is called.
    const validateCode = twoFactorAuthCode ? credentials.validateCode : code;
    const onyxOperationToCleanUpAnonymousUser = buildOnyxDataToCleanUpAnonymousUser();
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                ...CONST_1.default.DEFAULT_ACCOUNT_DATA,
                isLoading: true,
                loadingForm: twoFactorAuthCode ? CONST_1.default.FORMS.VALIDATE_TFA_CODE_FORM : CONST_1.default.FORMS.VALIDATE_CODE_FORM,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.SESSION,
            value: { autoAuthState: CONST_1.default.AUTO_AUTH_STATE.SIGNING_IN },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
                loadingForm: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CREDENTIALS,
            value: {
                accountID,
                validateCode,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.SESSION,
            value: { autoAuthState: CONST_1.default.AUTO_AUTH_STATE.JUST_SIGNED_IN },
        },
        onyxOperationToCleanUpAnonymousUser,
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
                loadingForm: null,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.SESSION,
            value: { autoAuthState: CONST_1.default.AUTO_AUTH_STATE.FAILED },
        },
    ];
    Device.getDeviceInfoWithID().then((deviceInfo) => {
        const params = {
            accountID,
            validateCode,
            twoFactorAuthCode,
            preferredLocale,
            deviceInfo,
        };
        API.write(types_1.WRITE_COMMANDS.SIGN_IN_USER_WITH_LINK, params, { optimisticData, successData, failureData });
    });
}
/**
 * Initializes the state of the automatic authentication when the user clicks on a magic link.
 *
 * This method is called in componentDidMount event of the lifecycle.
 * When the user gets authenticated, the component is unmounted and then remounted
 * when AppNavigator switches from PublicScreens to AuthScreens.
 * That's the reason why autoAuthState initialization is skipped while the last state is SIGNING_IN.
 */
function initAutoAuthState(cachedAutoAuthState) {
    const signedInStates = [CONST_1.default.AUTO_AUTH_STATE.SIGNING_IN, CONST_1.default.AUTO_AUTH_STATE.JUST_SIGNED_IN];
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, {
        autoAuthState: signedInStates.includes(cachedAutoAuthState) ? CONST_1.default.AUTO_AUTH_STATE.JUST_SIGNED_IN : CONST_1.default.AUTO_AUTH_STATE.NOT_STARTED,
    });
}
function invalidateCredentials() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.CREDENTIALS, { autoGeneratedLogin: '', autoGeneratedPassword: '' });
}
function invalidateAuthToken() {
    NetworkStore.setAuthToken(INVALID_TOKEN);
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { authToken: INVALID_TOKEN, encryptedAuthToken: INVALID_TOKEN });
}
/**
 * Send an expired session to FE and invalidate the session in the BE perspective. Action is delayed for 15s
 */
function expireSessionWithDelay() {
    // expires the session after 15s
    setTimeout(() => {
        NetworkStore.setAuthToken(INVALID_TOKEN);
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { authToken: INVALID_TOKEN, encryptedAuthToken: INVALID_TOKEN, creationDate: new Date().getTime() - CONST_1.default.SESSION_EXPIRATION_TIME_MS });
    }, 15000);
}
/**
 * Clear the credentials and partial sign in session so the user can taken back to first Login step
 */
function clearSignInData() {
    react_native_onyx_1.default.multiSet({
        [ONYXKEYS_1.default.ACCOUNT]: null,
        [ONYXKEYS_1.default.CREDENTIALS]: null,
    });
}
/**
 * Reset navigation to a brand new state with Home as the initial screen.
 */
function resetNavigationState() {
    Navigation_1.default.isNavigationReady().then(() => {
        navigationRef_1.default.resetRoot({ index: 0, routes: [{ name: NAVIGATORS_1.default.REPORTS_SPLIT_NAVIGATOR }] });
    });
}
/**
 * Put any logic that needs to run when we are signed out here. This can be triggered when the current tab or another tab signs out.
 * - Cancels pending network calls - any lingering requests are discarded to prevent unwanted storage writes
 * - Clears all current params of the Home route - the login page URL should not contain any parameter
 */
function cleanupSession() {
    Pusher_1.default.disconnect();
    Timers_1.default.clearAll();
    Welcome.resetAllChecks();
    MainQueue.clear();
    HttpUtils_1.default.cancelPendingRequests();
    PersistedRequests.clear();
    NetworkConnection_1.default.clearReconnectionCallbacks();
    SessionUtils.resetDidUserLogInDuringSession();
    resetNavigationState();
    (0, clearCache_1.default)().then(() => {
        Log_1.default.info('Cleared all cache data', true, {}, true);
    });
    (0, Sound_1.clearSoundAssetsCache)();
    Timing_1.default.clearData();
}
function clearAccountMessages() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.ACCOUNT, {
        success: '',
        errors: null,
        message: null,
        isLoading: false,
    });
}
function setAccountError(error) {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.ACCOUNT, { errors: ErrorUtils.getMicroSecondOnyxErrorWithMessage(error) });
}
// It's necessary to throttle requests to reauthenticate since calling this multiple times will cause Pusher to
// reconnect each time when we only need to reconnect once. This way, if an authToken is expired and we try to
// subscribe to a bunch of channels at once we will only reauthenticate and force reconnect Pusher once.
const reauthenticatePusher = (0, throttle_1.default)(() => {
    Log_1.default.info('[Pusher] Re-authenticating and then reconnecting');
    Authentication.reauthenticate(types_1.SIDE_EFFECT_REQUEST_COMMANDS.AUTHENTICATE_PUSHER)
        .then((wasSuccessful) => {
        if (!wasSuccessful) {
            return;
        }
        Pusher_1.default.reconnect();
    })
        .catch(() => {
        console.debug('[PusherConnectionManager]', 'Unable to re-authenticate Pusher because we are offline.');
    });
}, 5000, { trailing: false });
exports.reauthenticatePusher = reauthenticatePusher;
function authenticatePusher(socketID, channelName, callback) {
    Log_1.default.info('[PusherAuthorizer] Attempting to authorize Pusher', false, { channelName });
    const params = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        socket_id: socketID,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        channel_name: channelName,
        shouldRetry: false,
        forceNetworkRequest: true,
    };
    // We use makeRequestWithSideEffects here because we need to authorize to Pusher (an external service) each time a user connects to any channel.
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    return API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.AUTHENTICATE_PUSHER, params)
        .then((response) => {
        if (response?.jsonCode === CONST_1.default.JSON_CODE.NOT_AUTHENTICATED) {
            Log_1.default.hmmm('[PusherAuthorizer] Unable to authenticate Pusher because authToken is expired');
            callback?.(new Error('Pusher failed to authenticate because authToken is expired'), { auth: '' });
            // Attempt to refresh the authToken then reconnect to Pusher
            reauthenticatePusher();
            return;
        }
        if (response?.jsonCode !== CONST_1.default.JSON_CODE.SUCCESS) {
            Log_1.default.hmmm('[PusherAuthorizer] Unable to authenticate Pusher for reason other than expired session');
            callback?.(new Error(`Pusher failed to authenticate because code: ${response?.jsonCode} message: ${response?.message}`), { auth: '' });
            return;
        }
        Log_1.default.info('[PusherAuthorizer] Pusher authenticated successfully', false, { channelName });
        if (callback) {
            callback(null, response);
        }
        else {
            return {
                auth: response.auth,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                shared_secret: response.shared_secret,
            };
        }
    })
        .catch((error) => {
        Log_1.default.hmmm('[PusherAuthorizer] Unhandled error: ', { channelName, error });
        callback?.(new Error('AuthenticatePusher request failed'), { auth: '' });
    });
}
/**
 * Request a new validation link / magic code to unlink an unvalidated secondary login from a primary login
 */
function requestUnlinkValidationLink() {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: true,
                errors: null,
                message: null,
                loadingForm: CONST_1.default.FORMS.UNLINK_LOGIN_FORM,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
                message: 'unlinkLoginForm.linkSent',
                loadingForm: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
                loadingForm: null,
            },
        },
    ];
    const params = { email: credentials.login };
    API.write(types_1.WRITE_COMMANDS.REQUEST_UNLINK_VALIDATION_LINK, params, { optimisticData, successData, failureData });
}
function unlinkLogin(accountID, validateCode) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                ...CONST_1.default.DEFAULT_ACCOUNT_DATA,
                isLoading: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
                message: 'unlinkLoginForm.successfullyUnlinkedLogin',
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.CREDENTIALS,
            value: {
                login: '',
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
            },
        },
    ];
    const params = {
        accountID,
        validateCode,
    };
    API.write(types_1.WRITE_COMMANDS.UNLINK_LOGIN, params, {
        optimisticData,
        successData,
        failureData,
    });
}
/**
 * Toggles two-factor authentication based on the `enable` parameter
 */
function toggleTwoFactorAuth(enable, twoFactorAuthCode = '') {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
            },
        },
    ];
    if (enable) {
        API.write(types_1.WRITE_COMMANDS.ENABLE_TWO_FACTOR_AUTH, null, { optimisticData, successData, failureData });
        return;
    }
    // A 2FA code is required to disable 2FA
    const params = { twoFactorAuthCode };
    // eslint-disable-next-line rulesdir/no-multiple-api-calls
    API.write(types_1.WRITE_COMMANDS.DISABLE_TWO_FACTOR_AUTH, params, { optimisticData, successData, failureData });
}
function clearDisableTwoFactorAuthErrors() {
    react_native_onyx_1.default.merge(ONYXKEYS_1.default.ACCOUNT, { errorFields: { requiresTwoFactorAuth: null } });
}
function updateAuthTokenAndOpenApp(authToken, encryptedAuthToken) {
    // Update authToken in Onyx and in our local variables so that API requests will use the new authToken
    (0, updateSessionAuthTokens_1.default)(authToken, encryptedAuthToken);
    // Note: It is important to manually set the authToken that is in the store here since
    // reconnectApp will immediate post and use the local authToken. Onyx updates subscribers lately so it is not
    // enough to do the updateSessionAuthTokens() call above.
    NetworkStore.setAuthToken(authToken ?? null);
    (0, App_1.openApp)();
}
function validateTwoFactorAuth(twoFactorAuthCode, shouldClearData) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
            },
        },
    ];
    const params = { twoFactorAuthCode };
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.TWO_FACTOR_AUTH_VALIDATE, params, { optimisticData, successData, failureData }).then((response) => {
        if (!response?.authToken) {
            return;
        }
        // Clear onyx data if the user has just signed in and is forced to add 2FA
        if (shouldClearData) {
            const keysToPreserveWithPrivatePersonalDetails = [...App_1.KEYS_TO_PRESERVE, ONYXKEYS_1.default.PRIVATE_PERSONAL_DETAILS];
            react_native_onyx_1.default.clear(keysToPreserveWithPrivatePersonalDetails).then(() => updateAuthTokenAndOpenApp(response.authToken, response.encryptedAuthToken));
            return;
        }
        updateAuthTokenAndOpenApp(response.authToken, response.encryptedAuthToken);
    });
}
/**
 * Waits for a user to sign in.
 *
 * If the user is already signed in (`authToken` is truthy), the promise resolves immediately.
 * Otherwise, the promise will resolve when the `authToken` in `ONYXKEYS.SESSION` becomes truthy via the Onyx callback.
 * The promise will not reject on failed login attempt.
 *
 * @returns A promise that resolves to `true` once the user is signed in.
 * @example
 * waitForUserSignIn().then(() => {
 *   console.log('User is signed in!');
 * });
 */
function waitForUserSignIn() {
    return new Promise((resolve) => {
        if (session.authToken) {
            resolve(true);
        }
        else {
            authPromiseResolver = resolve;
        }
    });
}
function handleExitToNavigation(exitTo) {
    react_native_1.InteractionManager.runAfterInteractions(() => {
        waitForUserSignIn().then(() => {
            Navigation_1.default.waitForProtectedRoutes().then(() => {
                Navigation_1.default.goBack();
                Navigation_1.default.navigate(exitTo);
            });
        });
    });
}
function signInWithValidateCodeAndNavigate(accountID, validateCode, twoFactorAuthCode = '', exitTo) {
    signInWithValidateCode(accountID, validateCode, twoFactorAuthCode);
    if (exitTo) {
        handleExitToNavigation(exitTo);
    }
    else {
        Navigation_1.default.goBack();
    }
}
/**
 * check if the route can be accessed by anonymous user
 *
 * @param {string} route
 */
const canAnonymousUserAccessRoute = (route) => {
    const reportID = (0, ReportUtils_1.getReportIDFromLink)(route);
    if (reportID) {
        return true;
    }
    const parsedReportRouteParams = (0, ReportUtils_1.parseReportRouteParams)(route);
    let routeRemovedReportId = route;
    if (parsedReportRouteParams?.reportID) {
        routeRemovedReportId = route.replace(parsedReportRouteParams?.reportID, ':reportID');
    }
    if (route.startsWith('/')) {
        routeRemovedReportId = routeRemovedReportId.slice(1);
    }
    const routesAccessibleByAnonymousUser = [ROUTES_1.default.SIGN_IN_MODAL, ROUTES_1.default.REPORT_WITH_ID_DETAILS.route, ROUTES_1.default.REPORT_WITH_ID_DETAILS_SHARE_CODE.route, ROUTES_1.default.CONCIERGE];
    const isMagicLink = CONST_1.default.REGEX.ROUTES.VALIDATE_LOGIN.test(`/${route}`);
    if (routesAccessibleByAnonymousUser.includes(routeRemovedReportId) || isMagicLink) {
        return true;
    }
    return false;
};
exports.canAnonymousUserAccessRoute = canAnonymousUserAccessRoute;
function AddWorkEmail(workEmail) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.ONBOARDING_WORK_EMAIL_FORM,
            value: {
                onboardingWorkEmail: workEmail,
                isLoading: true,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.ONBOARDING_WORK_EMAIL_FORM,
            value: {
                isLoading: false,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.FORMS.ONBOARDING_WORK_EMAIL_FORM,
            value: {
                isLoading: false,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_ONBOARDING,
            value: {
                isMergingAccountBlocked: true,
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.ADD_WORK_EMAIL, { workEmail }, {
        optimisticData,
        successData,
        failureData,
    });
}
function MergeIntoAccountAndLogin(workEmail, validateCode, accountID) {
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ONBOARDING_ERROR_MESSAGE,
            value: '',
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: true,
                loadingForm: CONST_1.default.FORMS.VALIDATE_CODE_FORM,
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ONBOARDING_ERROR_MESSAGE,
            value: '',
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.NVP_ONBOARDING,
            value: {
                isMergeAccountStepCompleted: true,
            },
        },
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
                loadingForm: null,
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                isLoading: false,
                loadingForm: null,
            },
        },
    ];
    // eslint-disable-next-line rulesdir/no-api-side-effects-method
    API.makeRequestWithSideEffects(types_1.SIDE_EFFECT_REQUEST_COMMANDS.MERGE_INTO_ACCOUNT_AND_LOGIN, { workEmail, validateCode, accountID }, {
        optimisticData,
        successData,
        failureData,
    }).then((response) => {
        if (response?.jsonCode === CONST_1.default.JSON_CODE.EXP_ERROR) {
            // If the error other than invalid code, we show a blocking screen
            if (response?.message === CONST_1.default.MERGE_ACCOUNT_INVALID_CODE_ERROR || response?.title === CONST_1.default.MERGE_ACCOUNT_INVALID_CODE_ERROR) {
                react_native_onyx_1.default.merge(ONYXKEYS_1.default.ONBOARDING_ERROR_MESSAGE, (0, Localize_1.translateLocal)('contacts.genericFailureMessages.validateSecondaryLogin'));
            }
            else {
                react_native_onyx_1.default.merge(ONYXKEYS_1.default.NVP_ONBOARDING, { isMergingAccountBlocked: true });
            }
            return;
        }
        // When the action is successful, we need to update the new authToken and encryptedAuthToken
        // This action needs to be synchronous as the user will be logged out due to middleware if old authToken is used
        // For more information see the slack discussion: https://expensify.slack.com/archives/C08CZDJFJ77/p1742838796040369
        return SequentialQueue.waitForIdle().then(() => {
            if (!response?.authToken || !response?.encryptedAuthToken) {
                return;
            }
            updateAuthTokenAndOpenApp(response.authToken, response.encryptedAuthToken);
        });
    });
}
/**
 * To reset SMS delivery failure
 */
function resetSMSDeliveryFailureStatus(login) {
    const params = { login };
    const optimisticData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                errors: null,
                smsDeliveryFailureStatus: {
                    isLoading: true,
                },
            },
        },
    ];
    const successData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                smsDeliveryFailureStatus: {
                    isLoading: false,
                },
            },
        },
    ];
    const failureData = [
        {
            onyxMethod: react_native_onyx_1.default.METHOD.MERGE,
            key: ONYXKEYS_1.default.ACCOUNT,
            value: {
                errors: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                smsDeliveryFailureStatus: {
                    isLoading: false,
                },
            },
        },
    ];
    API.write(types_1.WRITE_COMMANDS.RESET_SMS_DELIVERY_FAILURE_STATUS, params, { optimisticData, successData, failureData });
}
