"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const Icon_1 = require("@components/Icon");
const Expensicons = require("@components/Icon/Expensicons");
const Illustrations = require("@components/Icon/Illustrations");
const Text_1 = require("@components/Text");
const TextLink_1 = require("@components/TextLink");
const useLocalize_1 = require("@hooks/useLocalize");
const useOnyx_1 = require("@hooks/useOnyx");
const useTheme_1 = require("@hooks/useTheme");
const useThemeStyles_1 = require("@hooks/useThemeStyles");
const Navigation_1 = require("@libs/Navigation/Navigation");
const variables_1 = require("@styles/variables");
const Session = require("@userActions/Session");
const ONYXKEYS_1 = require("@src/ONYXKEYS");
function ExpiredValidateCodeModal() {
    const theme = (0, useTheme_1.default)();
    const styles = (0, useThemeStyles_1.default)();
    const [credentials] = (0, useOnyx_1.default)(ONYXKEYS_1.default.CREDENTIALS);
    const { translate } = (0, useLocalize_1.default)();
    return (<react_native_1.View style={styles.deeplinkWrapperContainer}>
            <react_native_1.View style={styles.deeplinkWrapperMessage}>
                <react_native_1.View style={styles.mb2}>
                    <Icon_1.default width={variables_1.default.modalTopIconWidth} height={variables_1.default.modalTopIconHeight} src={Illustrations.ToddBehindCloud}/>
                </react_native_1.View>
                <Text_1.default style={[styles.textHeadline, styles.textXXLarge, styles.textAlignCenter]}>{translate('validateCodeModal.expiredCodeTitle')}</Text_1.default>
                <react_native_1.View style={[styles.mt2, styles.mb2]}>
                    {credentials?.login ? (<Text_1.default style={styles.textAlignCenter}>
                            {translate('validateCodeModal.expiredCodeDescription')}
                            {translate('validateCodeModal.or')}{' '}
                            <TextLink_1.default onPress={() => {
                Session.beginSignIn(credentials?.login ?? '');
                Navigation_1.default.setNavigationActionToMicrotaskQueue(Navigation_1.default.goBack);
            }}>
                                {translate('validateCodeModal.requestOneHere')}
                            </TextLink_1.default>
                        </Text_1.default>) : (<Text_1.default style={styles.textAlignCenter}>{translate('validateCodeModal.expiredCodeDescription')}.</Text_1.default>)}
                </react_native_1.View>
            </react_native_1.View>
            <react_native_1.View style={styles.deeplinkWrapperFooter}>
                <Icon_1.default width={variables_1.default.modalWordmarkWidth} height={variables_1.default.modalWordmarkHeight} fill={theme.success} src={Expensicons.ExpensifyWordmark}/>
            </react_native_1.View>
        </react_native_1.View>);
}
ExpiredValidateCodeModal.displayName = 'ExpiredValidateCodeModal';
exports.default = ExpiredValidateCodeModal;
