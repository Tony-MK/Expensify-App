"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var PressableWithFeedback_1 = require("@components/Pressable/PressableWithFeedback");
var Text_1 = require("@components/Text");
var useLocalize_1 = require("@hooks/useLocalize");
var useOnyx_1 = require("@hooks/useOnyx");
var useThemeStyles_1 = require("@hooks/useThemeStyles");
var CONST_1 = require("@src/CONST");
var ONYXKEYS_1 = require("@src/ONYXKEYS");
function ChangeExpensifyLoginLink(_a) {
    var onPress = _a.onPress;
    var styles = (0, useThemeStyles_1.default)();
    var _b = (0, useLocalize_1.default)(), translate = _b.translate, formatPhoneNumber = _b.formatPhoneNumber;
    var credentials = (0, useOnyx_1.default)(ONYXKEYS_1.default.CREDENTIALS, { canBeMissing: true })[0];
    return (<react_native_1.View style={[styles.changeExpensifyLoginLinkContainer, styles.mt3]}>
            {!!(credentials === null || credentials === void 0 ? void 0 : credentials.login) && <Text_1.default style={styles.mr1}>{translate('loginForm.notYou', { user: formatPhoneNumber(credentials.login) })}</Text_1.default>}
            <PressableWithFeedback_1.default style={[styles.link]} onPress={onPress} role={CONST_1.default.ROLE.LINK} accessibilityLabel={translate('common.goBack')}>
                <Text_1.default style={[styles.link]}>{translate('common.goBack')}.</Text_1.default>
            </PressableWithFeedback_1.default>
        </react_native_1.View>);
}
ChangeExpensifyLoginLink.displayName = 'ChangeExpensifyLoginLink';
exports.default = ChangeExpensifyLoginLink;
