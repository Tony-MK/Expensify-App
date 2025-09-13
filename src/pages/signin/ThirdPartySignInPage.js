"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const react_native_safe_area_context_1 = require("react-native-safe-area-context");
const AppleSignIn_1 = require("@components/SignInButtons/AppleSignIn");
const GoogleSignIn_1 = require("@components/SignInButtons/GoogleSignIn");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
const ROUTES_1 = require("@src/ROUTES");
const SignInPageLayout_1 = require("./SignInPageLayout");
const Terms_1 = require("./Terms");
/* Dedicated screen that the desktop app links to on the web app, as Apple/Google
 * sign-in cannot work fully within Electron, so we escape to web and redirect
 * to desktop once we have an Expensify auth token.
 */
function ThirdPartySignInPage({ signInProvider }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    const goBack = () => {
        Navigation_1.default.navigate(ROUTES_1.default.HOME);
    };
    const [account] = (0, useOnyx_1.default)(ONYXKEYS_1.default.ACCOUNT, { canBeMissing: true });
    return (<react_native_safe_area_context_1.SafeAreaView style={[styles.signInPage]}>
            {account?.isLoading ? (<react_native_1.View style={styles.thirdPartyLoadingContainer}>
                    <react_native_1.ActivityIndicator size="large"/>
                </react_native_1.View>) : (<SignInPageLayout_1.default welcomeHeader={translate('welcomeText.getStarted')} shouldShowWelcomeHeader>
                    {signInProvider === CONST_1.default.SIGN_IN_METHOD.APPLE ? <AppleSignIn_1.default isDesktopFlow/> : <GoogleSignIn_1.default isDesktopFlow/>}
                    <Text_1.default style={[styles.mt5]}>{translate('thirdPartySignIn.redirectToDesktopMessage')}</Text_1.default>
                    <Text_1.default style={[styles.mt5]}>{translate('thirdPartySignIn.goBackMessage', { provider: signInProvider })}</Text_1.default>
                    <TextLink_1.default style={[styles.link]} onPress={goBack}>
                        {translate('common.goBack')}.
                    </TextLink_1.default>
                    <react_native_1.View style={[styles.mt5]}>
                        <Terms_1.default />
                    </react_native_1.View>
                </SignInPageLayout_1.default>)}
        </react_native_safe_area_context_1.SafeAreaView>);
}
ThirdPartySignInPage.displayName = 'ThirdPartySignInPage';
exports.default = ThirdPartySignInPage;
