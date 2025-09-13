"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_apple_authentication_1 = require("@invertase/react-native-apple-authentication");
const react_1 = require("react");
const IconButton_1 = require("@components/SignInButtons/IconButton");
const Log_1 = require("@libs/Log");
const Session = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
/**
 * Apple Sign In method for iOS that returns identityToken.
 * @returns Promise that returns a string when resolved
 */
function appleSignInRequest() {
    return react_native_apple_authentication_1.default
        .performRequest({
        requestedOperation: react_native_apple_authentication_1.default.Operation.LOGIN,
        // FULL_NAME must come first, see https://github.com/invertase/react-native-apple-authentication/issues/293.
        requestedScopes: [react_native_apple_authentication_1.default.Scope.FULL_NAME, react_native_apple_authentication_1.default.Scope.EMAIL],
    })
        .then((response) => react_native_apple_authentication_1.default.getCredentialStateForUser(response.user).then((credentialState) => {
        if (credentialState !== react_native_apple_authentication_1.default.State.AUTHORIZED) {
            Log_1.default.alert('[Apple Sign In] Authentication failed. Original response: ', { response });
            throw new Error('Authentication failed');
        }
        return response.identityToken;
    }));
}
/**
 * Apple Sign In button for iOS.
 */
function AppleSignIn({ onPress = () => { } }) {
    const handleSignIn = () => {
        appleSignInRequest()
            .then((token) => Session.beginAppleSignIn(token))
            .catch((error) => {
            if (error.code === react_native_apple_authentication_1.default.Error.CANCELED) {
                return null;
            }
            Log_1.default.alert('[Apple Sign In] Apple authentication failed', error);
        });
    };
    return (<IconButton_1.default onPress={() => {
            onPress();
            handleSignIn();
        }} provider={CONST_1.default.SIGN_IN_METHOD.APPLE}/>);
}
AppleSignIn.displayName = 'AppleSignIn';
exports.default = AppleSignIn;
