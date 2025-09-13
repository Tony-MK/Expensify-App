"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const PressableWithoutFeedback_1 = require("@components/Pressable/PressableWithoutFeedback");
const useLocalize_1 = require("@hooks/useLocalize");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const providerData = {
    [CONST_1.default.SIGN_IN_METHOD.APPLE]: {
        icon: Expensicons.AppleLogo,
        accessibilityLabel: 'common.signInWithApple',
    },
    [CONST_1.default.SIGN_IN_METHOD.GOOGLE]: {
        icon: Expensicons.GoogleLogo,
        accessibilityLabel: 'common.signInWithGoogle',
    },
};
function IconButton({ onPress = () => { }, provider }) {
    const { translate } = (0, useLocalize_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    return (<PressableWithoutFeedback_1.default onPress={onPress} style={styles.signInIconButton} role={CONST_1.default.ROLE.BUTTON} accessibilityLabel={translate(providerData[provider].accessibilityLabel)}>
            <Icon_1.default src={providerData[provider].icon} height={40} width={40}/>
        </PressableWithoutFeedback_1.default>);
}
IconButton.displayName = 'IconButton';
exports.default = IconButton;
