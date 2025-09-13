"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_apple_authentication_1 = require("@invertase/react-native-apple-authentication");
const react_1 = require("react");
const IconButton_1 = require("@components/SignInButtons/IconButton");
const Log_1 = require("@libs/Log");
const Session = require("@userActions/Session");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
/**
 * Apple Sign In Configuration for Android.
 */
const config = {
    clientId: CONFIG_1.default.APPLE_SIGN_IN.SERVICE_ID,
    redirectUri: CONFIG_1.default.APPLE_SIGN_IN.REDIRECT_URI,
    responseType: react_native_apple_authentication_1.appleAuthAndroid.ResponseType.ALL,
    scope: react_native_apple_authentication_1.appleAuthAndroid.Scope.ALL,
};
/**
 * Apple Sign In method for Android that returns authToken.
 * @returns Promise that returns a string when resolved
 */
function appleSignInRequest() {
    react_native_apple_authentication_1.appleAuthAndroid.configure(config);
    return react_native_apple_authentication_1.appleAuthAndroid
        .signIn()
        .then((response) => response.id_token)
        .catch((e) => {
        throw e;
    });
}
/**
 * Apple Sign In button for Android.
 */
function AppleSignIn({ onPress = () => { } }) {
    const handleSignIn = () => {
        appleSignInRequest()
            .then((token) => Session.beginAppleSignIn(token))
            .catch((error) => {
            if (error.message === react_native_apple_authentication_1.appleAuthAndroid.Error.SIGNIN_CANCELLED) {
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
