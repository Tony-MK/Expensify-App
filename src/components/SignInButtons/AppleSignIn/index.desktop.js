"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const IconButton_1 = require("@components/SignInButtons/IconButton");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONFIG_1 = require("@src/CONFIG");
const CONST_1 = require("@src/CONST");
const ROUTES_1 = require("@src/ROUTES");
const appleSignInWebRouteForDesktopFlow = `${CONFIG_1.default.EXPENSIFY.NEW_EXPENSIFY_URL}${ROUTES_1.default.APPLE_SIGN_IN}`;
/**
 * Apple Sign In button for desktop flow
 */
function AppleSignIn() {
    const styles = (0, useThemeStyles_1.default)();
    return (<react_native_1.View style={styles.desktopSignInButtonContainer}>
            <IconButton_1.default onPress={() => {
            window.open(appleSignInWebRouteForDesktopFlow);
        }} provider={CONST_1.default.SIGN_IN_METHOD.APPLE}/>
        </react_native_1.View>);
}
AppleSignIn.displayName = 'AppleSignIn';
exports.default = AppleSignIn;
