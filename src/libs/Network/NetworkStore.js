"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShouldUseNewPartnerName = getShouldUseNewPartnerName;
exports.getAuthToken = getAuthToken;
exports.setAuthToken = setAuthToken;
exports.getCurrentUserEmail = getCurrentUserEmail;
exports.hasReadRequiredDataFromStorage = hasReadRequiredDataFromStorage;
exports.resetHasReadRequiredDataFromStorage = resetHasReadRequiredDataFromStorage;
exports.hasReadShouldUseNewPartnerNameFromStorage = hasReadShouldUseNewPartnerNameFromStorage;
exports.isOffline = isOffline;
exports.onReconnection = onReconnection;
exports.isAuthenticating = isAuthenticating;
exports.setIsAuthenticating = setIsAuthenticating;
exports.getCredentials = getCredentials;
exports.checkRequiredData = checkRequiredData;
exports.isSupportAuthToken = isSupportAuthToken;
exports.isSupportRequest = isSupportRequest;
exports.getLastShortAuthToken = getLastShortAuthToken;
exports.setLastShortAuthToken = setLastShortAuthToken;
const react_native_onyx_1 = require("react-native-onyx");
const types_1 = require("@libs/API/types");
const Log_1 = require("@libs/Log");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
let credentials;
let lastShortAuthToken;
let authToken;
let authTokenType;
let currentUserEmail = null;
let offline = false;
let authenticating = false;
let shouldUseNewPartnerName;
// Allow code that is outside of the network listen for when a reconnection happens so that it can execute any side-effects (like flushing the sequential network queue)
let reconnectCallback;
function triggerReconnectCallback() {
    if (typeof reconnectCallback !== 'function') {
        return;
    }
    return reconnectCallback();
}
function onReconnection(callbackFunction) {
    reconnectCallback = callbackFunction;
}
let resolveIsReadyPromise;
let isReadyPromise = new Promise((resolve) => {
    resolveIsReadyPromise = resolve;
});
let resolveShouldUseNewPartnerNamePromise;
const shouldUseNewPartnerNamePromise = new Promise((resolve) => {
    resolveShouldUseNewPartnerNamePromise = resolve;
    // On non-hybrid app variants we can resolve immediately.
    if (!CONFIG_1.default.IS_HYBRID_APP) {
        resolveShouldUseNewPartnerNamePromise();
    }
});
/**
 * This is a hack to workaround the fact that Onyx may not yet have read these values from storage by the time Network starts processing requests.
 * If the values are undefined we haven't read them yet. If they are null or have a value then we have and the network is "ready".
 */
function checkRequiredData() {
    if (authToken === undefined || credentials === undefined) {
        return;
    }
    resolveIsReadyPromise();
}
function resetHasReadRequiredDataFromStorage() {
    // Create a new promise and a new resolve function
    isReadyPromise = new Promise((resolve) => {
        resolveIsReadyPromise = resolve;
    });
}
// Use connectWithoutView since this doesn't affect to any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.SESSION,
    callback: (val) => {
        authToken = val?.authToken ?? null;
        authTokenType = val?.authTokenType ?? null;
        currentUserEmail = val?.email ?? null;
        checkRequiredData();
    },
});
// Use connectWithoutView since this doesn't affect to any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.CREDENTIALS,
    callback: (val) => {
        credentials = val ?? null;
        checkRequiredData();
    },
});
if (CONFIG_1.default.IS_HYBRID_APP) {
    react_native_onyx_1.default.connectWithoutView({
        key: ONYXKEYS_1.default.HYBRID_APP,
        callback: (val) => {
            // If this value is not set, we can assume that we are using old partner name.
            shouldUseNewPartnerName = val?.shouldUseNewPartnerName ?? false;
            Log_1.default.info(`[HybridApp] User requests should use ${val?.shouldUseNewPartnerName ? 'new' : 'old'} partner name`);
            resolveShouldUseNewPartnerNamePromise();
        },
    });
}
// We subscribe to the online/offline status of the network to determine when we should fire off API calls
// vs queueing them for later.
// Use connectWithoutView since this doesn't affect to any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.NETWORK,
    callback: (network) => {
        if (!network) {
            return;
        }
        // Client becomes online emit connectivity resumed event
        if (offline && !network.isOffline) {
            triggerReconnectCallback();
        }
        offline = !!network.shouldForceOffline || !!network.isOffline;
    },
});
function getCredentials() {
    return credentials;
}
function isOffline() {
    return offline;
}
function getAuthToken() {
    return authToken;
}
function getLastShortAuthToken() {
    return lastShortAuthToken;
}
function setLastShortAuthToken(newLastAuthToken) {
    lastShortAuthToken = newLastAuthToken;
}
function isSupportRequest(command) {
    return [
        types_1.WRITE_COMMANDS.OPEN_APP,
        types_1.READ_COMMANDS.SEARCH,
        types_1.WRITE_COMMANDS.UPDATE_NEWSLETTER_SUBSCRIPTION,
        types_1.WRITE_COMMANDS.OPEN_REPORT,
        types_1.WRITE_COMMANDS.CREATE_WORKSPACE_APPROVAL,
        types_1.WRITE_COMMANDS.UPDATE_WORKSPACE_APPROVAL,
        types_1.WRITE_COMMANDS.REMOVE_WORKSPACE_APPROVAL,
        types_1.SIDE_EFFECT_REQUEST_COMMANDS.RECONNECT_APP,
        types_1.READ_COMMANDS.OPEN_CARD_DETAILS_PAGE,
        types_1.READ_COMMANDS.GET_POLICY_CATEGORIES,
        types_1.READ_COMMANDS.OPEN_POLICY_CATEGORIES_PAGE,
        types_1.READ_COMMANDS.OPEN_POLICY_COMPANY_CARDS_PAGE,
        types_1.READ_COMMANDS.OPEN_POLICY_COMPANY_CARDS_FEED,
        types_1.READ_COMMANDS.OPEN_POLICY_DISTANCE_RATES_PAGE,
        types_1.READ_COMMANDS.OPEN_POLICY_ACCOUNTING_PAGE,
        types_1.READ_COMMANDS.OPEN_POLICY_EXPENSIFY_CARDS_PAGE,
        types_1.READ_COMMANDS.OPEN_POLICY_MORE_FEATURES_PAGE,
        types_1.READ_COMMANDS.OPEN_POLICY_PROFILE_PAGE,
        types_1.READ_COMMANDS.OPEN_POLICY_REPORT_FIELDS_PAGE,
        types_1.READ_COMMANDS.OPEN_POLICY_INITIAL_PAGE,
        types_1.READ_COMMANDS.OPEN_INITIAL_SETTINGS_PAGE,
        types_1.READ_COMMANDS.OPEN_POLICY_TAGS_PAGE,
        types_1.READ_COMMANDS.OPEN_SUBSCRIPTION_PAGE,
        types_1.READ_COMMANDS.OPEN_POLICY_TAXES_PAGE,
        types_1.READ_COMMANDS.OPEN_POLICY_WORKFLOWS_PAGE,
        types_1.READ_COMMANDS.OPEN_WORKSPACE_VIEW,
        types_1.READ_COMMANDS.OPEN_PAYMENTS_PAGE,
        types_1.READ_COMMANDS.OPEN_WORKSPACE_MEMBERS_PAGE,
        types_1.READ_COMMANDS.SEARCH_FOR_REPORTS,
        types_1.READ_COMMANDS.OPEN_SEARCH_PAGE,
    ].some((cmd) => cmd === command);
}
function isSupportAuthToken() {
    return authTokenType === CONST_1.default.AUTH_TOKEN_TYPES.SUPPORT;
}
function setAuthToken(newAuthToken) {
    authToken = newAuthToken;
}
function getCurrentUserEmail() {
    return currentUserEmail;
}
function hasReadRequiredDataFromStorage() {
    return isReadyPromise;
}
function isAuthenticating() {
    return authenticating;
}
function setIsAuthenticating(val) {
    authenticating = val;
}
function getShouldUseNewPartnerName() {
    if (!CONFIG_1.default.IS_HYBRID_APP) {
        return true;
    }
    return shouldUseNewPartnerName;
}
function hasReadShouldUseNewPartnerNameFromStorage() {
    return shouldUseNewPartnerNamePromise;
}
