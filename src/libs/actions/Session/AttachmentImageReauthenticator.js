"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_onyx_1 = require("react-native-onyx");
const Authentication_1 = require("@libs/Authentication");
const Log_1 = require("@libs/Log");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
let isOffline = false;
let active = false;
let currentActiveSession = {};
let timer;
// The delay before requesting a reauthentication once activated
// When the session is expired we will give it this time to reauthenticate via normal flows, like the Reauthentication middleware, in an attempt to not duplicate authentication requests
// also, this is an arbitrary number so we may tweak as needed
const TIMING_BEFORE_REAUTHENTICATION_MS = 3500; // 3.5s
// We subscribe to network's online/offline status
// We do not depend on updates on the UI to check for the offline status
// So we can use `connectWithoutView` here.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.NETWORK,
    callback: (network) => {
        if (!network) {
            return;
        }
        isOffline = !!network.shouldForceOffline || !!network.isOffline;
    },
});
// We subscribe to sessions changes
// We do not depend on updates on the UI to call the `deactivate` function
// So we can use `connectWithoutView` here.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.SESSION,
    callback: (value) => {
        if (!value || isSameSession(value) || !active) {
            return;
        }
        deactivate();
    },
});
function isSameSession(session) {
    return currentActiveSession.authToken === session.authToken && currentActiveSession.encryptedAuthToken === session.encryptedAuthToken;
}
function deactivate() {
    active = false;
    currentActiveSession = {};
    clearInterval(timer);
}
/**
 * The reauthenticator is currently only used by attachment images and only when the current session is expired.
 * It will only request reauthentication only once between two receptions of different sessions from Onyx
 * @param session the current session
 * @returns
 */
function activate(session) {
    if (!session || isSameSession(session) || isOffline) {
        return;
    }
    currentActiveSession = session;
    active = true;
    timer = setTimeout(tryReauthenticate, TIMING_BEFORE_REAUTHENTICATION_MS);
}
function tryReauthenticate() {
    if (isOffline || !active) {
        return;
    }
    (0, Authentication_1.reauthenticate)().catch((error) => {
        Log_1.default.hmmm('Could not reauthenticate attachment image or receipt', { error });
    });
}
exports.default = activate;
