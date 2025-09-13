"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const IconButton_1 = require("@components/SignInButtons/IconButton");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const googleSignInWebRouteForDesktopFlow = `${CONFIG_1.default.EXPENSIFY.NEW_EXPENSIFY_URL}${ROUTES_1.default.GOOGLE_SIGN_IN}`;
/**
 * Google Sign In button for desktop flow.
 */
function GoogleSignIn() {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={styles.desktopSignInButtonContainer}>
            <IconButton_1.default onPress={() => {
            window.open(googleSignInWebRouteForDesktopFlow);
        }} provider={CONST_1.default.SIGN_IN_METHOD.GOOGLE}/>
        </react_native_1.View>);
}
GoogleSignIn.displayName = 'GoogleSignIn';
exports.default = GoogleSignIn;
