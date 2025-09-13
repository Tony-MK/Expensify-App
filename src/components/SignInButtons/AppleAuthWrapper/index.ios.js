"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_apple_authentication_1 = require("@invertase/react-native-apple-authentication");
const react_1 = require("react");
const Session = require("@userActions/Session");
/**
 * Apple Sign In wrapper for iOS
 * revokes the session if the credential is revoked.
 */
function AppleAuthWrapper() {
    (0, react_1.useEffect)(() => {
        if (!react_native_apple_authentication_1.default.isSupported) {
            return;
        }
        const removeListener = react_native_apple_authentication_1.default.onCredentialRevoked(() => {
            Session.signOut();
        });
        return () => {
            removeListener();
        };
    }, []);
    return null;
}
exports.default = AppleAuthWrapper;
