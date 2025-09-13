"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
const Text_1 = require("@components/Text");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const CONST_1 = require("@src/CONST");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ChangeExpensifyLoginLink({ onPress }) {
    const styles = (0, useThemeStyles_1.default)();
    const { translate, formatPhoneNumber } = (0, useLocalize_1.default)();
    const [credentials] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CREDENTIALS, { canBeMissing: true });
    return (<react_native_1.View style={[styles.changeExpensifyLoginLinkContainer, styles.mt3]}>
            {!!credentials?.login && <Text_1.default style={styles.mr1}>{translate('loginForm.notYou', { user: formatPhoneNumber(credentials.login) })}</Text_1.default>}
            <PressableWithFeedback_1.default style={[styles.link]} onPress={onPress} role={CONST_1.default.ROLE.LINK} accessibilityLabel={translate('common.goBack')}>
                <Text_1.default style={[styles.link]}>{translate('common.goBack')}.</Text_1.default>
            </PressableWithFeedback_1.default>
        </react_native_1.View>);
}
ChangeExpensifyLoginLink.displayName = 'ChangeExpensifyLoginLink';
exports.default = ChangeExpensifyLoginLink;
