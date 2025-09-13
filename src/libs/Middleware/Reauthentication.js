"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reauthThrottle = void 0;
exports.reauthenticate = reauthenticate;
exports.resetReauthentication = resetReauthentication;
const SignInRedirect_1 = require("@libs/actions/SignInRedirect");
const Authentication_1 = require("@libs/Authentication");
const Log_1 = require("@libs/Log");
const MainQueue_1 = require("@libs/Network/MainQueue");
const NetworkStore_1 = require("@libs/Network/NetworkStore");
const NetworkConnection_1 = require("@libs/NetworkConnection");
const Request_1 = require("@libs/Request");
const RequestThrottle_1 = require("@libs/RequestThrottle");
const CONST_1 = require("@src/CONST");
// We store a reference to the active authentication request so that we are only ever making one request to authenticate at a time.
let isAuthenticating = null;
const reauthThrottle = new RequestThrottle_1.default('Re-authentication');
exports.reauthThrottle = reauthThrottle;
function reauthenticate(commandName) {
    if (isAuthenticating) {
        return isAuthenticating;
    }
    isAuthenticating = retryReauthenticate(commandName).finally(() => {
        // Reset the isAuthenticating state to allow new reauthentication flows to start fresh
        isAuthenticating = null;
    });
    return isAuthenticating;
}
function retryReauthenticate(commandName) {
    return (0, Authentication_1.reauthenticate)(commandName).catch((error) => {
        return reauthThrottle
            .sleep(error, 'Authenticate')
            .then(() => retryReauthenticate(commandName))
            .catch(() => {
            (0, NetworkStore_1.setIsAuthenticating)(false);
            Log_1.default.hmmm('Redirecting to Sign In because we failed to reauthenticate after multiple attempts', { error });
            (0, SignInRedirect_1.default)('passwordForm.error.fallback');
            return false;
        });
    });
}
// Used in tests to reset the reauthentication state
function resetReauthentication() {
    // Resets the authentication state flag to allow new reauthentication flows to start fresh
    isAuthenticating = null;
    // Clears any pending reauth timeouts set by reauthThrottle.sleep()
    reauthThrottle.clear();
}
const Reauthentication = (response, request, isFromSequentialQueue) => response
    .then((data) => {
    // If there is no data for some reason then we cannot reauthenticate
    if (!data) {
        Log_1.default.hmmm('Undefined data in Reauthentication');
        return;
    }
    if (data.jsonCode === CONST_1.default.JSON_CODE.NOT_AUTHENTICATED) {
        if ((0, NetworkStore_1.isOffline)()) {
            // If we are offline and somehow handling this response we do not want to reauthenticate
            throw new Error('Unable to reauthenticate because we are offline');
        }
        // There are some API requests that should not be retried when there is an auth failure like
        // creating and deleting logins. In those cases, they should handle the original response instead
        // of the new response created by handleExpiredAuthToken.
        const shouldRetry = request?.data?.shouldRetry;
        const apiRequestType = request?.data?.apiRequestType;
        // For the SignInWithShortLivedAuthToken command, if the short token expires, the server returns a 407 error,
        // and credentials are still empty at this time, which causes reauthenticate to throw an error (requireParameters),
        // and the subsequent SaveResponseInOnyx also cannot be executed, so we need this parameter to skip the reauthentication logic.
        const skipReauthentication = request?.data?.skipReauthentication;
        if ((!shouldRetry && !apiRequestType) || skipReauthentication) {
            if (isFromSequentialQueue) {
                return data;
            }
            if (request.resolve) {
                request.resolve(data);
            }
            return data;
        }
        // We are already authenticating and using the DeprecatedAPI so we will replay the request
        if (!apiRequestType && (0, NetworkStore_1.isAuthenticating)()) {
            (0, MainQueue_1.replay)(request);
            return data;
        }
        return reauthenticate(request?.commandName)
            .then((wasSuccessful) => {
            if (!wasSuccessful) {
                return;
            }
            if (isFromSequentialQueue || apiRequestType === CONST_1.default.API_REQUEST_TYPE.MAKE_REQUEST_WITH_SIDE_EFFECTS) {
                return (0, Request_1.processWithMiddleware)(request, isFromSequentialQueue);
            }
            if (apiRequestType === CONST_1.default.API_REQUEST_TYPE.READ) {
                NetworkConnection_1.default.triggerReconnectionCallbacks('read request made with expired authToken');
                return Promise.resolve();
            }
            (0, MainQueue_1.replay)(request);
        })
            .catch(() => {
            if (isFromSequentialQueue || apiRequestType) {
                throw new Error('Failed to reauthenticate');
            }
            // If we make it here, then our reauthenticate request could not be made due to a networking issue. The original request can be retried safely.
            (0, MainQueue_1.replay)(request);
        });
    }
    if (isFromSequentialQueue) {
        return data;
    }
    if (request.resolve) {
        request.resolve(data);
    }
    // Return response data so we can chain the response with the following middlewares.
    return data;
})
    .catch((error) => {
    // If the request is on the sequential queue, re-throw the error so we can decide to retry or not
    if (isFromSequentialQueue) {
        throw error;
    }
    // If we have caught a networking error from a DeprecatedAPI request, resolve it as unable to retry, otherwise the request will never resolve or reject.
    if (request.resolve) {
        request.resolve({ jsonCode: CONST_1.default.JSON_CODE.UNABLE_TO_RETRY });
    }
});
exports.default = Reauthentication;
