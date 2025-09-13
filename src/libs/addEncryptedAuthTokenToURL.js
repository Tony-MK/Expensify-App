"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const react_native_onyx_1 = require("react-native-onyx");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
let encryptedAuthToken = '';
// We use `connectWithoutView` here since this connection only updates a module-level variable
// and doesn't need to trigger component re-renders. UI components get the current token
// value when they call the exported function.
react_native_onyx_1.default.connectWithoutView({
    key: ONYXKEYS_1.default.SESSION,
    callback: (session) => (encryptedAuthToken = session?.encryptedAuthToken ?? ''),
});
/**
 * Add encryptedAuthToken to this attachment URL
 */
function default_1(url, hasOtherParameters = false) {
    const symbol = hasOtherParameters ? '&' : '?';
    return `${url}${symbol}encryptedAuthToken=${encodeURIComponent(encryptedAuthToken)}`;
}
