"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_hybrid_app_1 = require("@expensify/react-native-hybrid-app");
const react_native_onyx_1 = require("react-native-onyx");
const ErrorUtils_1 = require("@libs/ErrorUtils");
const lastVisitedTabPathUtils_1 = require("@libs/Navigation/helpers/lastVisitedTabPathUtils");
const CONFIG_1 = require("@src/CONFIG");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const HybridApp_1 = require("./HybridApp");
const Policy_1 = require("./Policy/Policy");
let currentIsOffline;
let currentShouldForceOffline;
// We use connectWithoutView here because we only need to track network state for sign-in redirect logic, which is not connected to any changes on the UI layer
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.NETWORK,
    callback: (network) => {
        currentIsOffline = network?.isOffline;
        currentShouldForceOffline = network?.shouldForceOffline;
    },
});
function clearStorageAndRedirect(errorMessage) {
    // Under certain conditions, there are key-values we'd like to keep in storage even when a user is logged out.
    // We pass these into the clear() method in order to avoid having to reset them on a delayed tick and getting
    // flashes of unwanted default state.
    const keysToPreserve = [];
    keysToPreserve.push(ONYXKEYS_1.default.NVP_PREFERRED_LOCALE);
    keysToPreserve.push(ONYXKEYS_1.default.ARE_TRANSLATIONS_LOADING);
    keysToPreserve.push(ONYXKEYS_1.default.PREFERRED_THEME);
    keysToPreserve.push(ONYXKEYS_1.default.ACTIVE_CLIENTS);
    keysToPreserve.push(ONYXKEYS_1.default.DEVICE_ID);
    keysToPreserve.push(ONYXKEYS_1.default.SHOULD_USE_STAGING_SERVER);
    keysToPreserve.push(ONYXKEYS_1.default.IS_DEBUG_MODE_ENABLED);
    // After signing out, set ourselves as offline if we were offline before logging out and we are not forcing it.
    // If we are forcing offline, ignore it while signed out, otherwise it would require a refresh because there's no way to toggle the switch to go back online while signed out.
    if (currentIsOffline && !currentShouldForceOffline) {
        keysToPreserve.push(ONYXKEYS_1.default.NETWORK);
    }
    return react_native_onyx_1.default.clear(keysToPreserve).then(() => {
        if (CONFIG_1.default.IS_HYBRID_APP) {
            (0, HybridApp_1.resetSignInFlow)();
            react_native_hybrid_app_1.default.signOutFromOldDot();
        }
        (0, Policy_1.clearAllPolicies)();
        if (!errorMessage) {
            return;
        }
        // `Onyx.clear` reinitializes the Onyx instance with initial values so use `Onyx.merge` instead of `Onyx.set`
        react_native_onyx_1.default.merge(ONYXKEYS_1.default.SESSION, { errors: (0, ErrorUtils_1.getMicroSecondOnyxErrorWithMessage)(errorMessage) });
    });
}
/**
 * Cleanup actions resulting in the user being redirected to the Sign-in page
 * - Clears the Onyx store - removing the authToken redirects the user to the Sign-in page
 *
 * Normally this method would live in Session.js, but that would cause a circular dependency with Network.js.
 *
 * @param [errorMessage] error message to be displayed on the sign in page
 */
function redirectToSignIn(errorMessage) {
    return clearStorageAndRedirect(errorMessage).then(() => {
        (0, lastVisitedTabPathUtils_1.clearSessionStorage)();
    });
}
exports.default = redirectToSignIn;
