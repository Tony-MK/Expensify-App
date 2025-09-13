"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const google_signin_1 = require("@react-native-google-signin/google-signin");
const react_1 = require("react");
const IconButton_1 = require("@components/SignInButtons/IconButton");
const getPlatform_1 = require("@libs/getPlatform");
const Log_1 = require("@libs/Log");
const Session_1 = require("@userActions/Session");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
/**
 * Helper function returning webClientId based on a platform used
 */
function getWebClientId() {
    if (!CONFIG_1.default.IS_HYBRID_APP) {
        return CONFIG_1.default.GOOGLE_SIGN_IN.WEB_CLIENT_ID;
    }
    return (0, getPlatform_1.default)() === CONST_1.default.PLATFORM.ANDROID ? CONFIG_1.default.GOOGLE_SIGN_IN.HYBRID_APP.WEB_CLIENT_ID.ANDROID : CONFIG_1.default.GOOGLE_SIGN_IN.HYBRID_APP.WEB_CLIENT_ID.IOS;
}
/**
 * Google Sign In method for iOS and android that returns identityToken.
 */
function googleSignInRequest() {
    google_signin_1.GoogleSignin.configure({
        webClientId: getWebClientId(),
        iosClientId: CONFIG_1.default.IS_HYBRID_APP ? CONFIG_1.default.GOOGLE_SIGN_IN.HYBRID_APP.IOS_CLIENT_ID : CONFIG_1.default.GOOGLE_SIGN_IN.IOS_CLIENT_ID,
        offlineAccess: false,
    });
    // The package on android can sign in without prompting
    // the user which is not what we want. So we sign out
    // before signing in to ensure the user is prompted.
    google_signin_1.GoogleSignin.signOut();
    google_signin_1.GoogleSignin.signIn()
        .then((response) => response.idToken)
        .then((token) => (0, Session_1.beginGoogleSignIn)(token))
        .catch((error) => {
        // Handle unexpected error shape
        if (error?.code === undefined) {
            Log_1.default.alert(`[Google Sign In] Google sign in failed: ${JSON.stringify(error)}`);
            return;
        }
        /** The logged code is useful for debugging any new errors that are not specifically handled. To decode, see:
          - The common status codes documentation: https://developers.google.com/android/reference/com/google/android/gms/common/api/CommonStatusCodes
          - The Google Sign In codes documentation: https://developers.google.com/android/reference/com/google/android/gms/auth/api/signin/GoogleSignInStatusCodes
        */
        if (error.code === google_signin_1.statusCodes.SIGN_IN_CANCELLED) {
            Log_1.default.info('[Google Sign In] Google Sign In cancelled');
        }
        else {
            Log_1.default.alert(`[Google Sign In] Error Code: ${error.code}. ${error.message}`, {}, false);
        }
    });
}
/**
 * Google Sign In button for iOS.
 */
function GoogleSignIn({ onPress = () => { } }) {
    return (<IconButton_1.default onPress={() => {
            onPress();
            googleSignInRequest();
        }} provider={CONST_1.default.SIGN_IN_METHOD.GOOGLE}/>);
}
GoogleSignIn.displayName = 'GoogleSignIn';
exports.default = GoogleSignIn;
