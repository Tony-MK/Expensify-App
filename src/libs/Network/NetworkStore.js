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
var react_native_onyx_1 = require("react-native-onyx");
var types_1 = require("@libs/API/types");
var Log_1 = require("@libs/Log");
var CONFIG_1 = require("@src/CONFIG");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
var credentials;
var lastShortAuthToken;
var authToken;
var authTokenType;
var currentUserEmail = null;
var offline = false;
var authenticating = false;
var shouldUseNewPartnerName;
// Allow code that is outside of the network listen for when a reconnection happens so that it can execute any side-effects (like flushing the sequential network queue)
var reconnectCallback;
function triggerReconnectCallback() {
    if (typeof reconnectCallback !== 'function') {
        return;
    }
    return reconnectCallback();
}
function onReconnection(callbackFunction) {
    reconnectCallback = callbackFunction;
}
var resolveIsReadyPromise;
var isReadyPromise = new Promise(function (resolve) {
    resolveIsReadyPromise = resolve;
});
var resolveShouldUseNewPartnerNamePromise;
var shouldUseNewPartnerNamePromise = new Promise(function (resolve) {
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
    isReadyPromise = new Promise(function (resolve) {
        resolveIsReadyPromise = resolve;
    });
}
// Use connectWithoutView since this doesn't affect to any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.SESSION,
    callback: function (val) {
        var _a, _b, _c;
        authToken = (_a = val === null || val === void 0 ? void 0 : val.authToken) !== null && _a !== void 0 ? _a : null;
        authTokenType = (_b = val === null || val === void 0 ? void 0 : val.authTokenType) !== null && _b !== void 0 ? _b : null;
        currentUserEmail = (_c = val === null || val === void 0 ? void 0 : val.email) !== null && _c !== void 0 ? _c : null;
        checkRequiredData();
    },
});
// Use connectWithoutView since this doesn't affect to any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.CREDENTIALS,
    callback: function (val) {
        credentials = val !== null && val !== void 0 ? val : null;
        checkRequiredData();
    },
});
if (CONFIG_1.default.IS_HYBRID_APP) {
    react_native_onyx_1.default.connectWithoutView({
        key: ONYXKEYS_1.default.HYBRID_APP,
        callback: function (val) {
            var _a;
            // If this value is not set, we can assume that we are using old partner name.
            shouldUseNewPartnerName = (_a = val === null || val === void 0 ? void 0 : val.shouldUseNewPartnerName) !== null && _a !== void 0 ? _a : false;
            Log_1.default.info("[HybridApp] User requests should use ".concat((val === null || val === void 0 ? void 0 : val.shouldUseNewPartnerName) ? 'new' : 'old', " partner name"));
            resolveShouldUseNewPartnerNamePromise();
        },
    });
}
// We subscribe to the online/offline status of the network to determine when we should fire off API calls
// vs queueing them for later.
// Use connectWithoutView since this doesn't affect to any UI
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.NETWORK,
    callback: function (network) {
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
    ].some(function (cmd) { return cmd === command; });
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
