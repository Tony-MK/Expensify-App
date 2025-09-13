"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Button_1 = require("@components/Button");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Session_1 = require("@userActions/Session");
const CONST_1 = require("@src/CONST");
function SignInButton() {
    const styles = (0, useThemeStyles_1.default)();
    const { translate } = (0, useLocalize_1.default)();
    return (<PressableWithoutFeedback_1.default accessibilityLabel={translate('sidebarScreen.buttonMySettings')} role={CONST_1.default.ROLE.BUTTON} onPress={() => (0, Session_1.signOutAndRedirectToSignIn)()}>
            <react_native_1.View style={(styles.signInButtonAvatar, styles.ph2)}>
                <Button_1.default success text={translate('common.signIn')} onPress={() => {
            (0, Session_1.signOutAndRedirectToSignIn)();
        }}/>
            </react_native_1.View>
        </PressableWithoutFeedback_1.default>);
}
SignInButton.displayName = 'SignInButton';
exports.default = SignInButton;
